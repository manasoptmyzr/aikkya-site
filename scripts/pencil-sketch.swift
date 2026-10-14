// Turns a photo into a soft pencil drawing that fades out at the edges,
// like the one on the home page. Uses macOS's built-in Core Image.
//
//   swift scripts/pencil-sketch.swift photo.jpg sketch.jpg [width] [--wash] [--light] [--crop=left,top,right,bottom]
//
// --wash   adds a soft wash of the photo's own colours under the pencil lines
// --light  lifts the shadows, lightens the lines and warms the colours, so an
//          evening photo reads as a warm, airy drawing rather than a dark one
// --crop   trims the photo first, as fractions of each side (e.g. --crop=0.12,0.16,0.1,0)
// The home page uses: --wash --light --crop=0.12,0.16,0.1,0
// The drawing is on white so the page can blend it into its own background.
import AppKit
import CoreImage
import Foundation

func f(_ name: String, _ params: [String: Any]) -> CIImage {
  let filter = CIFilter(name: name)!
  for (k, v) in params { filter.setValue(v, forKey: k) }
  return filter.outputImage!
}

let flags = CommandLine.arguments.filter { $0.hasPrefix("--") }
let wash = flags.contains("--wash")
let light = flags.contains("--light")
let crop = flags.first { $0.hasPrefix("--crop=") }.map { $0.dropFirst(7).split(separator: ",").compactMap { Double($0) } } ?? [0, 0, 0, 0]
let args = CommandLine.arguments.filter { !$0.hasPrefix("--") }
guard args.count >= 3, var src = CIImage(contentsOf: URL(fileURLWithPath: args[1])) else {
  print("usage: swift scripts/pencil-sketch.swift photo.jpg sketch.jpg [width]")
  exit(1)
}
if crop.count == 4 {
  let e = src.extent
  src = src.cropped(to: CGRect(x: e.minX + e.width * crop[0], y: e.minY + e.height * crop[3],
    width: e.width * (1 - crop[0] - crop[2]), height: e.height * (1 - crop[1] - crop[3])))
  src = src.transformed(by: CGAffineTransform(translationX: -src.extent.minX, y: -src.extent.minY))
}
if light {
  // Open up the shadows so dark corners don't turn into black blots.
  src = f("CIHighlightShadowAdjust", [kCIInputImageKey: src, "inputShadowAmount": 1.0, "inputHighlightAmount": 1.0])
  src = f("CIGammaAdjust", [kCIInputImageKey: src, "inputPower": 0.7])
}
let targetWidth = args.count > 3 ? Double(args[3]) ?? 2800 : 2800
let scale = min(1, targetWidth / src.extent.width)
src = src.transformed(by: CGAffineTransform(scaleX: scale, y: scale))
let extent = src.extent
let unit = extent.width / 1800 // keeps the look the same at any size

// Clean up noise first, so dark areas don't turn grainy.
let nr = f("CINoiseReduction", [kCIInputImageKey: src, "inputNoiseLevel": 0.08, "inputSharpness": 0.1])
let median = f("CIMedianFilter", [kCIInputImageKey: f("CIMedianFilter", [kCIInputImageKey: nr])])
let smooth = f("CIGaussianBlur", [kCIInputImageKey: median.clampedToExtent(), kCIInputRadiusKey: 1.2 * unit]).cropped(to: extent)

// Pencil: colour dodge of the greyscale over its blurred negative.
let gray = f("CIColorControls", [kCIInputImageKey: smooth, kCIInputSaturationKey: 0.0, kCIInputContrastKey: 1.05])
let inverted = f("CIColorInvert", [kCIInputImageKey: gray])
let blurred = f("CIGaussianBlur", [kCIInputImageKey: inverted.clampedToExtent(), kCIInputRadiusKey: 16 * unit]).cropped(to: extent)
let dodge = f("CIColorDodgeBlendMode", [kCIInputImageKey: blurred, kCIInputBackgroundImageKey: gray])
var pencil = f("CIGammaAdjust", [kCIInputImageKey: dodge, "inputPower": light ? 1.3 : 1.6])

if wash {
  // The real colours, softened and lightened, like watercolour under the pencil.
  let soft = f("CIColorControls", [
    kCIInputImageKey: f("CIGaussianBlur", [kCIInputImageKey: src.clampedToExtent(), kCIInputRadiusKey: 6 * unit]).cropped(to: extent),
    kCIInputSaturationKey: light ? 0.75 : 0.85, kCIInputContrastKey: light ? 0.8 : 0.9,
  ])
  // Warmer: a little more red and yellow, less blue.
  let warmed = light ? f("CIColorMatrix", [kCIInputImageKey: soft,
    "inputRVector": CIVector(x: 1.08, y: 0, z: 0, w: 0), "inputGVector": CIVector(x: 0, y: 1.03, z: 0, w: 0),
    "inputBVector": CIVector(x: 0, y: 0, z: 0.97, w: 0), "inputBiasVector": CIVector(x: 0.02, y: 0.02, z: 0.02, w: 0)]) : soft
  let a = light ? 0.52 : 0.55 // how much colour
  let tint = f("CIColorMatrix", [
    kCIInputImageKey: warmed,
    "inputRVector": CIVector(x: a, y: 0, z: 0, w: 0), "inputGVector": CIVector(x: 0, y: a, z: 0, w: 0),
    "inputBVector": CIVector(x: 0, y: 0, z: a, w: 0), "inputBiasVector": CIVector(x: 1 - a, y: 1 - a, z: 1 - a, w: 0),
  ])
  pencil = f("CIMultiplyBlendMode", [kCIInputImageKey: pencil, kCIInputBackgroundImageKey: tint])
}

// Full detail in the middle, fading to white before every edge, with an
// uneven border like a wash that dried on paper. Worked out pixel by pixel.
let w = extent.width, h = extent.height
func makeMask(width: Int, height: Int) -> CIImage {
  var seed: UInt64 = 42
  func rnd() -> Double { seed = seed &* 6364136223846793005 &+ 1442695040888963407; return Double(seed >> 11) / Double(1 << 53) }
  // Two layers of smooth random blotches for the uneven edge.
  func grid(_ cell: Int) -> (Int, Int, [Double]) {
    let gw = width / cell + 2, gh = height / cell + 2
    return (cell, gw, (0..<(gw * gh)).map { _ in rnd() })
  }
  let layers = [grid(Int(90 * unit)), grid(Int(28 * unit))]
  func noise(_ x: Int, _ y: Int) -> Double {
    var total = 0.0
    for (i, (cell, gw, values)) in layers.enumerated() {
      let fx = Double(x) / Double(cell), fy = Double(y) / Double(cell)
      let x0 = Int(fx), y0 = Int(fy), tx = fx - Double(x0), ty = fy - Double(y0)
      let sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty)
      let v = (values[y0 * gw + x0] * (1 - sx) + values[y0 * gw + x0 + 1] * sx) * (1 - sy)
        + (values[(y0 + 1) * gw + x0] * (1 - sx) + values[(y0 + 1) * gw + x0 + 1] * sx) * sy
      total += v * (i == 0 ? 0.7 : 0.3)
    }
    return total
  }
  func smooth(_ t: Double) -> Double { let c = min(max(t, 0), 1); return c * c * (3 - 2 * c) }
  var pixels = [UInt8](repeating: 0, count: width * height)
  for y in 0..<height {
    let v = Double(y) / Double(height)
    for x in 0..<width {
      let u = Double(x) / Double(width)
      // fade in from each edge, and round off the corners
      let sides = smooth(min(u, 1 - u) / 0.2) * smooth(min(v, 1 - v) / 0.22)
      let e = ((u - 0.5) * (u - 0.5) + (v - 0.5) * (v - 0.5)).squareRoot() / 0.5
      let m = sides * (1 - smooth((e - 0.75) / 0.6))
      let ragged = m + (noise(x, y) - 0.5) * (light ? 0.6 : 1.1) * 4 * m * (1 - m)
      pixels[y * width + x] = UInt8(min(max(ragged, 0), 1) * 255)
    }
  }
  let data = Data(pixels)
  let provider = CGDataProvider(data: data as CFData)!
  let cg = CGImage(width: width, height: height, bitsPerComponent: 8, bitsPerPixel: 8, bytesPerRow: width,
    space: CGColorSpaceCreateDeviceGray(), bitmapInfo: CGBitmapInfo(rawValue: 0), provider: provider,
    decode: nil, shouldInterpolate: true, intent: .defaultIntent)!
  return CIImage(cgImage: cg)
}
let mask = makeMask(width: Int(w), height: Int(h)).transformed(by: CGAffineTransform(translationX: extent.minX, y: extent.minY))
let white = CIImage(color: CIColor(red: 1, green: 1, blue: 1)).cropped(to: extent)
let drawing = f("CIBlendWithMask", [kCIInputImageKey: pencil, kCIInputBackgroundImageKey: white, kCIInputMaskImageKey: mask])

let ctx = CIContext(options: [.workingColorSpace: CGColorSpace(name: CGColorSpace.sRGB)!])
let cg = ctx.createCGImage(drawing.cropped(to: extent), from: extent)!
let jpeg = NSBitmapImageRep(cgImage: cg).representation(using: .jpeg, properties: [.compressionFactor: 0.88])!
try! jpeg.write(to: URL(fileURLWithPath: args[2]))
print("\(args[2]): \(Int(w)) x \(Int(h))")
