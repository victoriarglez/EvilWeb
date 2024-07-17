const _SUPPORTED_AREAS_ = ["local", "session", "sync"];

/**
 * Function to convert an integrer number into a string, with zeros to the left if needed based on the maximum value.
 * @param {int} _integrer - Value that will be converted into string. Must be greater than 0 and a whole number.
 * @param {int} _maxVal - Maximum to control the return string. If set to 10, the string will add a 0 to the left and so on. 
 * @returns {string|boolean}
 */
function intToString(_integrer, _maxVal) {
    if(_integrer < 0) return false;

    if(_maxVal < 10) return _integrer + "";
    if(_maxVal < 100) {
        if(_integrer < 10) return "0" + _integrer;
        return _integrer + "";
    }
    if(_maxVal < 1000) {
        if(_integrer < 10) return "00" + _integrer;
        if(_integrer < 100) return "0" + _integrer;
        return _integrer + "";
    }
    if(_maxVal < 10000) {
        if(_integrer < 10) return "000" + _integrer;
        if(_integrer < 100) return "00" + _integrer;
        if(_integrer < 1000) return "0" + _integrer;
        return _integrer + "";
    }
    if(_maxVal < 100000) {
        if(_integrer < 10) return "0000" + _integrer;
        if(_integrer < 100) return "000" + _integrer;
        if(_integrer < 1000) return "00" + _integrer;
        if(_integrer < 10000) return "0" + _integrer;
        return _integrer + "";
    }
    if(_maxVal < 1000000){
        if(_integrer < 10) return "00000" + _integrer;
        if(_integrer < 100) return "0000" + _integrer;
        if(_integrer < 1000) return "000" + _integrer;
        if(_integrer < 10000) return "00" + _integrer;
        if(_integrer < 100000) return "0" + _integrer;
        return _integrer + "";
    }
    return false;
}