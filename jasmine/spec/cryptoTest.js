describe('Simple CryptoMethod Operations', () => {
    let method;
    let mStatus = true;

    describe('Method without keys', () => {
        
        // Parameters of method
        let mName = "String to binary";
        let mNbKeys = 0;
        let mKeys = [];
        let mMethodFunction = stringToBin;
        
        beforeEach(() => {
            method = new CryptoMethod(mName, mNbKeys, mKeys, mMethodFunction, mStatus);
        });

        describe('Status', () => {
            it('Should be able to get status', () => {
                let status = method.getStatus();
                expect(status).toEqual(mStatus);
            });

            it('Should be able to change status', () => {
                method.changeStatus();
                expect(method.status).toBe(false);
    
            });
        });
        
        describe('Operations with list of keys', () => {
            it('Should be able to get array of keys', () => {
                let keys = method.getKeyList();
                expect(keys).toEqual(mKeys);
            });
        });

        describe('Other operations', () => {
            it('Should be able to get name', () => {
                let name = method.getName();
                expect(name).toEqual(mName);
            });
    
            it('Should be able to get number of keys', () => {
                let nbKeys = method.getNbKeys();
                expect(nbKeys).toEqual(mNbKeys);
            });
    
            
    
            it('Should be able to get method function', () => {
                let methodFunction = method.getMethodFunction();
                expect(methodFunction).toEqual(mMethodFunction);
            });
        });
    });
    describe('Method with keys', () => {
        // Parameters of method
        let mName = "Rotation";
        let mNbKeys = 1;
        let mKeys = Array(1).fill("");
        let mMethodFunction = rotation;
        
        beforeEach(() => {
            method = new CryptoMethod(mName, mNbKeys, mKeys, mMethodFunction, mStatus);
        });

        describe('Operations with list of keys', () => {
            it('Should be able to get array of keys', () => {
                let keys = method.getKeyList();
                expect(keys).toEqual(mKeys);
            });

            it('Should be able to set key', () => {
                let key = "12";
                let index = 0;
                method.addKey(key, index);
                expect(method.getKeyList().length).toEqual(1);
                expect(method.getKeyList()).toContain(key);
                
            });
        });

        describe('Other operations', () => {
    
            it('Should be able to get number of keys', () => {
                let nbKeys = method.getNbKeys();
                expect(nbKeys).toEqual(mNbKeys);
            });
        });
    });
});


describe('Verification of keys', () => {
    let method;

    // Parameters of method
    let mStatus = true;
    
    describe('Key of rotation method', () => {

        let mName = "Rotation";
        let mMethodFunction = rotation;
        let mNbKeys = 1;
        let mKeys = Array(1).fill("");

        beforeEach(() => {
            method = new CryptoMethod(mName, mNbKeys, mKeys, mMethodFunction, mStatus);
        });

        it('Should alert when key is not a number', () => {
            spyOn(window, 'alert');
            let key = "abc";
            let index = 0;
            method.addKey(key, index);
            let r = checkAllKeyValues(method);
            expect(window.alert).toHaveBeenCalledWith("Key must be a number between 0 and 26 for rotation method.");
            expect(r).toBe(false);
        });

        it('Should alert when key value is out of range (greater than 26)', () => {
            spyOn(window, 'alert');
            let key = "54";
            let index = 0;
            method.addKey(key, index);
            let r = checkAllKeyValues(method);
            expect(window.alert).toHaveBeenCalledWith("Key must be between 0 and 26 for rotation method.");
            expect(r).toBe(false);
        });

        it('Should alert when key value is out of range (less than 0)', () => {
            spyOn(window, 'alert');
            let key = "-51";
            let index = 0;
            method.addKey(key, index);
            let r = checkAllKeyValues(method);
            expect(window.alert).toHaveBeenCalledWith("Key must be between 0 and 26 for rotation method.");
            expect(r).toBe(false);
        });

        it('Valid key', () => {
            let key = "15";
            let index = 0;
            method.addKey(key, index);
            let r = checkAllKeyValues(method);
            expect(r).toBe(true);
        });
    });
});

describe('Comparison of names of CryptoMethods', () => {

    // Common parameters
    let mNbKeys = 0;
    let mKeys = [];
    let mStatus = true;

    it('Should return -1 when name of method1 is lexically before name of method2', () => {
        // Parameters of method1
        let m1Name = "Encode as URI";
        let m1MethodFunction = encodeAllURI;

        // Parameters of method2
        let m2Name = "Sha 256";
        let m2MethodFunction = sha256;

        let method1 = new CryptoMethod(m1Name, mNbKeys, mKeys, m1MethodFunction, mStatus);
        let method2 = new CryptoMethod(m2Name, mNbKeys, mKeys, m2MethodFunction, mStatus);
    
        let comparison = compareCryptoMethod(method1, method2);
        expect(comparison).toEqual(-1);
    });

    it('Should return 1 when name of method1 is lexically after name of method2', () => {
        // Parameters of method2
        let m2Name = "Encode as URI";
        let m2MethodFunction = encodeAllURI;

        // Parameters of method1
        let m1Name = "Sha 256";
        let m1MethodFunction = sha256;

        let method1 = new CryptoMethod(m1Name, mNbKeys, mKeys, m1MethodFunction, mStatus);
        let method2 = new CryptoMethod(m2Name, mNbKeys, mKeys, m2MethodFunction, mStatus);
    
        let comparison = compareCryptoMethod(method1, method2);
        expect(comparison).toEqual(1);
    });

    it('Should return 0 when names are the same', () => {
        // Parameters of method1
        let m1Name = "Encode as URI";
        let m1MethodFunction = encodeAllURI;

        // Parameters of method2
        let m2Name = "Encode as URI";;
        let m2MethodFunction = encodeAllURI;

        let method1 = new CryptoMethod(m1Name, mNbKeys, mKeys, m1MethodFunction, mStatus);
        let method2 = new CryptoMethod(m2Name, mNbKeys, mKeys, m2MethodFunction, mStatus);
    
        let comparison = compareCryptoMethod(method1, method2);
        expect(comparison).toEqual(0);
    });
});

describe('Cryptographic primitives', () => {

    let inputString = "Hello World!";
    // Value from rot13.com
    let rot13Answer = "Uryyb Jbeyq!";
    // value from rot47.net
    let rot47Answer = "w6==@ (@C=5P";
    let xorKey = "test";
    // value from www.dcode.fr/xor-cipher
    let xorString = "3c 0 1f 18 1b 45 24 1b 6 9 17 55"
    

    describe('Rot 13', () => {
        it('Rot13 encryption', () => {
            let rotated = rot13(inputString);
            expect(rotated).toEqual(rot13Answer);
        });
    
        it('Rot13 decryption', () => {
            let string = rot13(rot13Answer);
            expect(string).toEqual(inputString);
        });
    });
    
    describe('Rot47', () => {
        it('Rot47 encryption', () => {
            let rotated = rot47(inputString);
            expect(rotated).toEqual(rot47Answer);
        });

        it('Rot47 decryption', () => {
            let string = rot47(rot47Answer);
            expect(string).toEqual(inputString);
        });
    });

    describe('XOR', () => {
        it('XOR encryption', () => {
            let xorSum = encodeXOR(inputString, [xorKey]);
            expect(xorSum).toEqual(xorString);
        });

        it('XOR decryption', () => {
            let string = decodeXOR(xorString, [xorKey]);
            expect(string).toEqual(inputString);
        });
    });


});