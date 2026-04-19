# Rust Wasm Vue!

This is a simple example of using Rust and Multi-Threaded WebAssembly with Vue.js.

## Installation

- Ensure the latest NodeJS 24 LTS is available and Rust is [installed](https://rust-lang.org/tools/install/).
- Ensure `wasm-pack` is installed or install by running: `cargo install wasm-pack`
- Optionally ensure `dotnet-serve` is installed or install by running: `dotnet tool install dotnet-serve -g`
- Build Rust by running: `npm run compile` or `wasm-pack build --target web --out-dir src/pkg`

## Building WASM with Multithreaded support

`Cargo.toml`

```toml
[dependencies]
wasm-bindgen = "0.2"
rayon = "1.8"
wasm-bindgen-rayon = { version = "1.3", features = ["no-bundler"] }
```

`rust-toolchain.toml`

```toml
[toolchain]
channel = "nightly-2025-11-15"
components = ["rust-src"]
targets = ["wasm32-unknown-unknown"]
```

`.cargo/config.toml`

```toml
[target.wasm32-unknown-unknown]
rustflags = [
  "-C", "target-feature=+atomics,+bulk-memory",
  "-C", "link-arg=--shared-memory",
  "-C", "link-arg=--max-memory=1073741824",
  "-C", "link-arg=--import-memory",
  "-C", "link-arg=--export=__wasm_init_tls",
  "-C", "link-arg=--export=__tls_size",
  "-C", "link-arg=--export=__tls_align",
  "-C", "link-arg=--export=__tls_base"
]

[unstable]
build-std = ["panic_abort", "std"]
```

`js module`

```javascript
import init, {
  initThreadPool /* other exported assets */,
} from "./pkg/mt_wasm.js";

const numberOfThreads = navigator.hardwareConcurrency || 0;
await init();
await initThreadPool(numberOfThreads);
```

## Running the project

Multithreading in WASM depends on:

- Browser support for threads
- Requires Web Workers
- Requires SharedArrayBuffer
- Requires cross-origin isolation headers:
  - `Cross-Origin-Opener-Policy: same-origin`
  - `Cross-Origin-Embedder-Policy: require-corp`

When using the configured `dotnet-serve` instance the necessary headers are already setup.

- cli: `npm run start`.

📝 The project uses `dotnet-serve` to serve the assets and is configured using `.netconfig`.

## References

- https://vuejs.org
- https://doc.rust-lang.org/stable/book/
- https://wasm-bindgen.github.io/wasm-bindgen/
- https://github.com/RReverser/wasm-bindgen-rayon
- https://rust-lang.org/tools/install/
