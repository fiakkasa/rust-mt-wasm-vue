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

const sum = (source, data) => {
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

const sumAsync = async (source, data) => {
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

const parallelSum = (source, data) => {

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

const parallelSumAsync = async (source, data) => {

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
            case 'sum':
                self.postMessage(
                    sum(event.data.type, event.data)
                );
                return;
            case 'sum_async':
                self.postMessage(
                    await sumAsync(event.data.type, event.data)
                );
                return;
            case 'parallel_sum':
                self.postMessage(
                    parallelSum(event.data.type, event.data)
                );
                return;
            case 'parallel_sum_async':
                self.postMessage(
                    await parallelSumAsync(event.data.type, event.data)
                );
                return;
        }
    };
};

startWorker();