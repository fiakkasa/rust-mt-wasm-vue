use js_sys::Promise;
use rayon::prelude::*;
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::{JsFuture, js_sys};

pub use wasm_bindgen_rayon::init_thread_pool;

#[wasm_bindgen]
pub fn sum_blocking(numbers: &[u32]) -> u64 {
    numbers.iter().map(|x| *x as u64).sum()
}

#[wasm_bindgen]
pub async fn sum_async_promise(numbers: Vec<u32>) -> u64 {
    let promise = Promise::resolve(&JsValue::NULL);
    let _ = JsFuture::from(promise).await;

    numbers.iter().map(|x| *x as u64).sum()
}

#[wasm_bindgen]
pub fn parallel_sum_blocking(numbers: &[u32]) -> u64 {
    numbers.par_iter().map(|x| *x as u64).sum()
}

#[wasm_bindgen]
pub async fn parallel_sum_async_promise(numbers: Vec<u32>) -> u64 {
    let promise = Promise::resolve(&JsValue::NULL);
    let _ = JsFuture::from(promise).await;

    numbers.par_iter().map(|x| *x as u64).sum()
}
