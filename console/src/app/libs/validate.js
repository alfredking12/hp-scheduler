export default {
    isalpha: function(a) {
        return /^[a-zA-Z]*$/g.test(a);
    },

    isalnum: function(a) {
        return /^[0-9a-zA-Z]*$/g.test(a);
    },
    
    isdigit: function(a) {
        return /^[0-9]*$/g.test(a);
    }
}