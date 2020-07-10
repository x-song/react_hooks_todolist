export  function createSet(payload) {
    return {
        type:'set',
        payload
    }
}
export  function createAdd(payload) {
    return {
        type:'add',
        payload
    }
}
export  function createRemove(payload) {
    return {
        type:'remove',
        payload
    }
}
export  function createToggle(payload) {
    return {
        type:'toggle',
        payload
    }
}
