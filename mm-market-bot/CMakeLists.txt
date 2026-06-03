cmake_minimum_required(VERSION 3.18 FATAL_ERROR)
project(mm_core LANGUAGES CXX CUDA)


set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# 2. Tell CUDA to inherit the C++ standard from the host compiler
set(CMAKE_CUDA_STANDARD 17)
set(CMAKE_CUDA_STANDARD_REQUIRED ON)

# 3. Define your target architectures (e.g., "native" or specific SMs like "80;89")
set(CMAKE_CUDA_ARCHITECTURES all-major)

# Find Node Addon API headers (installed via npm locally)
execute_process(
    COMMAND node -p "require('node-addon-api').include"
    OUTPUT_VARIABLE NODE_ADDON_API_DIR
    OUTPUT_STRIP_TRAILING_WHITESPACE
)

# Core library target
add_library(${PROJECT_NAME} SHARED
    src/api/bindings.cpp
    src/core/orderbook.cpp
    src/core/engine.cpp
    src/cuda/kernels.cu
)

# Position Independent Code needed for Node.js native extensions
set_target_properties(${PROJECT_NAME} PROPERTIES 
    POSITION_INDEPENDENT_CODE ON
    PREFIX ""
    SUFFIX ".node"
)

target_include_directories(${PROJECT_NAME} PRIVATE 
    ${NODE_ADDON_API_DIR}
    src/core
    src/cuda
    src/api
)

# Link CUDA runtime libraries
target_link_libraries(${PROJECT_NAME} PRIVATE cudart)
