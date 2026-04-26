import init, {
    initThreadPool,
    sum_blocking,
    sum_async_promise,
    parallel_sum_blocking,
    parallel_sum_async_promise
} from './pkg/mt_wasm.js';

let _workerStarted = false;

const initWorker = async (source, numberOfThreads) => {
    if (_workerStarted) {
        return {
            source,
            type: 'RESULT',
            result: _workerStarted
        };
    }

    try {
        await init();
        await initThreadPool(numberOfThreads);
        _workerStarted = true;

        return {
            source,
            type: 'RESULT',
            result: _workerStarted
        };
    } catch (error) {
        return {
            source,
            type: 'ERROR',
            result: _workerStarted,
            error
        };
    }
};

const jsSum = (source, data) => {
    try {
        const { collection, startTime, iteration } = data || {};
        const result = collection.reduce((acc, v) => acc + v, 0);

        return {
            source,
            type: 'RESULT',
            result,
            startTime,
            iteration
        };
    } catch (error) {
        return {
            source,
            type: 'ERROR',
            result: 0,
            error
        };
    }
};

const jsSumAsync = async (source, data) => {
    try {
        const { collection, startTime, iteration } = data || {};
        const result = await new Promise(res =>
            setTimeout(() =>
                res(collection.reduce((acc, v) => acc + v, 0))
            )
        );

        return {
            source,
            type: 'RESULT',
            result,
            startTime,
            iteration
        };
    } catch (error) {
        return {
            source,
            type: 'ERROR',
            result: 0,
            error
        };
    }
};

const wasmSum = (source, data) => {
    try {
        const { collection, startTime, iteration } = data || {};
        const result = sum_blocking(collection);

        return {
            source,
            type: 'RESULT',
            result,
            startTime,
            iteration
        };
    } catch (error) {
        return {
            source,
            type: 'ERROR',
            result: 0,
            error
        };
    }
};

const wasmSumAsync = async (source, data) => {
    try {
        const { collection, startTime, iteration } = data || {};
        const result = await sum_async_promise(collection);

        return {
            source,
            type: 'RESULT',
            result,
            startTime,
            iteration
        };
    } catch (error) {
        return {
            source,
            type: 'ERROR',
            result: 0,
            error
        };
    }
};

const wasmParallelSum = (source, data) => {

    try {
        const { collection, startTime, iteration } = data || {};
        const result = parallel_sum_blocking(collection);

        return {
            source,
            type: 'RESULT',
            result,
            startTime,
            iteration
        };
    } catch (error) {
        return {
            source,
            type: 'ERROR',
            result: 0,
            error
        };
    }
};

const wasmParallelSumAsync = async (source, data) => {

    try {
        const { collection, startTime, iteration } = data || {};
        const result = await parallel_sum_async_promise(collection);

        return {
            source,
            type: 'RESULT',
            result,
            startTime,
            iteration
        };
    } catch (error) {
        return {
            source,
            type: 'ERROR',
            result: 0,
            error
        };
    }
};

async function startWorker() {
    self.onmessage = async (event) => {
        switch (event?.data?.type) {
            case 'init':
                self.postMessage(
                    await initWorker(
                        event.data.type,
                        Math.max(event.data.numberOfThreads, 2)
                    )
                );
                return;
            case 'js_sum':
                self.postMessage(
                    jsSum(event.data.type, event.data)
                );
                return;
            case 'js_sum_async':
                self.postMessage(
                    await jsSumAsync(event.data.type, event.data)
                );
                return;
            case 'wasm_sum':
                self.postMessage(
                    wasmSum(event.data.type, event.data)
                );
                return;
            case 'wasm_sum_async':
                self.postMessage(
                    await wasmSumAsync(event.data.type, event.data)
                );
                return;
            case 'wasm_parallel_sum':
                self.postMessage(
                    wasmParallelSum(event.data.type, event.data)
                );
                return;
            case 'wasm_parallel_sum_async':
                self.postMessage(
                    await wasmParallelSumAsync(event.data.type, event.data)
                );
                return;
        }
    };
};

startWorker();