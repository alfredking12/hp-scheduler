export default {
    merge: function(date, time) {

        if (!date || !time) return null;

        var ret = new Date();
        
        ret.setFullYear(date.getFullYear());
        ret.setMonth(date.getMonth());
        ret.getDate(date.getDate());
        
        ret.setHours(time.getHours());
        ret.setMinutes(time.getMinutes());
        ret.setSeconds(time.getSeconds());

        return ret;
    },

    date: function(timestamp) {
        if (!timestamp) return null;
        var t = new Date(timestamp);
        var ret = new Date();
        ret.setFullYear(t.getFullYear());
        ret.setMonth(t.getMonth());
        ret.getDate(t.getDate());
        return ret;
    },

    time: function(timestamp) {
        if (!timestamp) return null;
        var t = new Date(timestamp);
        var ret = new Date();
        ret.setHours(t.getHours());
        ret.setMinutes(t.getMinutes());
        ret.setSeconds(t.getSeconds());
        return ret;
    },
    
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