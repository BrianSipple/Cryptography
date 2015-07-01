function charToBin(char) {
  return char;
}

function XOR (a, b) {
  return ((a || b) && !( a && b));
}

var Sender = function(keyLimit){
  keyLimit = keyLimit || 10;
  this._privateInteger = Math.floor(Math.random() * keyLimit);
  this.partialKey = null;
  this._secretKey = null;
};

Sender.prototype.generatePartialKey = function(prime, base){
  this.partialKey = Math.pow(base, this._privateInteger) % prime;
};

Sender.prototype.generateSecretKey = function(prime, partialKey){
  this._secretKey = Math.pow(partialKey, this._privateInteger) % prime;
};

Sender.prototype.encryptMessage = function(plaintext){
  /* Should, letter by letter, convert the plaintext into ciphertext */
  var res = '';
  for (var i = 0, l = plaintext.length; i < l; i++) {
    res += String.fromCharCode(this._secretKey ^ plaintext.charCodeAt(i));
  }
  return res;
};

Sender.prototype.decryptMessage = function(ciphertext){

  var res = '';
  for (var i = 0, l = ciphertext.length; i < l; i++) {
    res+= String.fromCharCode(ciphertext.charCodeAt(i) ^ this._secretKey);
  }
  return res;

};

Sender.prototype.sendMessage = function(plaintext, recipient){
  /* Should generate the cipher text and send it to the recipient */
  /* (Hint:  see receiveMessage) */
  var cipherText = this.encryptMessage(plaintext);
  recipient.receiveMessage(cipherText);
};

Sender.prototype.receiveMessage = function(ciphertext){
  return this.decryptMessage(ciphertext);
};

var exchangeKeys = function(alice, bob, prime, base){
  /* Should govern the key exchange process for two parties to generate a shared secret key */
  prime = prime || 23;
  base = base || 5;
  alice.generatePartialKey(prime, base);
  bob.generatePartialKey(prime, base);
  alice.generateSecretKey(prime, bob.partialKey);
  bob.generateSecretKey(prime, alice.partialKey);

};
