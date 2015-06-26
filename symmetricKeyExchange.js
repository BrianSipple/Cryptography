var Sender = function(keyLimit){
  keyLimit = keyLimit || 10
  this._privateInteger = Math.floor(Math.random() * keyLimit);
  this.partialKey = null;
  this._secretKey = null;
}


Sender.prototype.generatePartialKey = function(prime, base){
  this.partialKey = Math.pow(base, this._privateInteger) % prime;
}

Sender.prototype.generateSecretKey = function(partialKey){
  this._secretKey = Math.pow(partialKey, this._privateInteger) % prime;
}

Sender.prototype.encryptMessage = function(plaintext){
  return plaintext ^ this._secretKey;
}

Sender.prototype.decryptMessage = function(ciphertext){
  return ciphertext ^ this._secretKey;
}

Sender.prototype.sendMessage = function(plaintext, recipient){
  var ciphertext = '';
  for(var i = 0; i < plaintext.length; i++){
    ciphertext += String.fromCharCode(this._secretKey ^ plaintext.charCodeAt(i));
  }
  recipient.receiveMessage(ciphertext);
}

Sender.prototype.receiveMessage = function(ciphertext){
  var plaintext = '';
  for(var i = 0; i < ciphertext.length; i++){
    plaintext += String.fromCharCode(this._secretKey ^ ciphertext.charCodeAt(i));
  }
  console.log(plaintext)
  return plaintext;
}

var exchangeKeys = function(alice, bob){
  prime = 23;
  base = 5;
  alice.generatePartialKey(prime, base);
  bob.generatePartialKey(prime, base);
  alice.generateSecretKey(bob.partialKey);
  bob.generateSecretKey(alice.partialKey)
}
