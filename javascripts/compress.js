var LZW = {

    pass: function(s){

        if(!s)
            s = "";

        var n = 0;

        var alfa = '0123456789abcdefghijklmnopqrstuvwxyv';

        var p = 1;
        
        for(var i = s.length - 1; i >= 0; i--){

            var k = s[i];

            if(alfa.indexOf(k) == -1) {
                alfa+=k
                var v = alfa.indexOf(k) + 257;
            } else {
                var v = k.charCodeAt(0)
            }

            n += (v*p);

            p += 1;

        }

        return n + 257;

    },

    compress: function (uncompressed, key) {
        "use strict";
        // Build the dictionary.


        var pwd = this.pass(key);

        var i,
            dictionary = {},
            c,
            wc,
            w = "",
            result = [],
            dictSize = 256;
        for (i = 0; i < 256; i += 1) {
            dictionary[String.fromCharCode(i)] = i + pwd;
        }
 
        for (i = 0; i < uncompressed.length; i += 1) {
            c = uncompressed.charAt(i);
            wc = w + c;
            //Do not use dictionary[wc] because javascript arrays 
            //will return values for array['pop'], array['push'] etc
           // if (dictionary[wc]) {
            if (dictionary.hasOwnProperty(wc)) {
                w = wc;
            } else {
                result.push(dictionary[w]);
                // Add wc to the dictionary.
                var key = dictSize++;
                dictionary[wc] = key + pwd;
                w = String(c);
            }
        }
 
        // Output the code for w.
        if (w !== "") {
            result.push(dictionary[w]);
        }
        return result;
    },
 
 
    decompress: function (compressed, key) {

        if(typeof compressed === 'string'){
            compressed = compressed.split(',');
        }


        var pwd = this.pass(key);

        "use strict";
        // Build the dictionary.
        var i,
            dictionary = [],
            w,
            result,
            k,
            entry = "",
            dictSize = 256;
        for (i = 0; i < 256; i += 1) {
            dictionary[i + pwd] = String.fromCharCode(i);
        }
        
        w = String.fromCharCode(compressed[0] - pwd);
        
        result = w;

        for (i = 1; i < compressed.length; i += 1) {
            k = compressed[i];
            
            if (dictionary[k]) {
                entry = dictionary[k];
            } else {
                
                if (parseInt(k) === (dictSize + pwd)) {
                    entry = w + w.charAt(0);
                } else {
                    return null;
                }
            }

 
            result += entry;

            
 
            // Add w+entry[0] to the dictionary.
            var key = dictSize++;
            dictionary[key + pwd] = w + entry.charAt(0);
 
            w = entry;
        }

        return result;
    }
}