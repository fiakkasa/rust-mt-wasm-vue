use js_sys::Promise;
use rayon::prelude::*;
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::{JsFuture, js_sys};

// #[cfg(feature = "parallel")]
pub use wasm_bindgen_rayon::init_thread_pool;

#[wasm_bindgen]
pub fn sum_blocking(numbers: &[u32]) -> u32 {
    numbers.iter().sum()
}

#[wasm_bindgen]
pub async fn sum_async_promise(numbers: Vec<u32>) -> u32 {
    let promise = Promise::resolve(&JsValue::NULL);
    let _ = JsFuture::from(promise).await;

    numbers.iter().sum()
}

#[wasm_bindgen]
pub fn parallel_sum_blocking(numbers: &[u32]) -> u32 {
    numbers.par_iter().sum()
}

#[wasm_bindgen]
pub async fn parallel_sum_async_promise(numbers: Vec<u32>) -> u32 {
    let promise = Promise::resolve(&JsValue::NULL);
    let _ = JsFuture::from(promise).await;

    numbers.par_iter().sum()
}
