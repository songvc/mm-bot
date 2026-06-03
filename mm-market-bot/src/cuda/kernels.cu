#include <cuda_runtime.h>
#include <iostream>

__global__ void calcAlphaKernel(float* d_out) {
    int idx = threadIdx.x + blockIdx.x * blockDim.x;
    if (idx == 0) {
        d_out[0] = 0.0042f; // Mock microstructural alpha metric calculated on GPU
    }
}

extern "C" float runCudaAlphaCalc() {
    float *d_out;
    float h_out = 0.0f;
    cudaMalloc(&d_out, sizeof(float));
    
    calcAlphaKernel<<<1, 1>>>(d_out);
    cudaDeviceSynchronize();
    
    cudaMemcpy(&h_out, d_out, sizeof(float), cudaMemcpyDeviceToHost);
    cudaFree(d_out);
    return h_out;
}
