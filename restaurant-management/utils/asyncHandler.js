function asyncHandler(fn) {
    return async (request, reply) => {
        try {
            return await fn(request, reply);
        } catch (error) {
            reply.send(error);
        }
    };
}

module.exports = asyncHandler;
