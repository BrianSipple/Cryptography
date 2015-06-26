var Identity = function(){
  this.privateKey = null;
  this.publicKey = null;
  this.modulus = null;
}

Identity.prototype.generateKeyPair = function(p, q){
  var prime1 = p;
  var prime2 = q;
  this.modulus = prime1 * prime2;
  var phi = (prime1 - 1) * (prime2 - 1);
  this.publicKey = findCoprime(phi);
  this.privateKey = calculateModInverse(this.publicKey, phi);
}

Identity.prototype.encryptMessage = function(plaintext, key, modulus){
  var ciphertext = '';
  var encryptedLetter
  for(var i = 0; i < plaintext.length; i++){
    encryptedLetter = Math.pow(letterToNumber(plaintext[i]), key) % modulus;
    ciphertext += numberToLetter(encryptedLetter);
  }
  return ciphertext;
}

Identity.prototype.signMessage = function(text){
  var signature = this.encryptMessage(text, this.privateKey, this.modulus);
  return signature;
}

Identity.prototype.confirmAuthenticity = function(text, signature, key, modulus){
  var unsignature = this.decryptMessage(signature, key, modulus);
  if(unsignature === text) return true;
  return false;
}

Identity.prototype.decryptMessage = function(ciphertext, key, modulus){
  var plaintext = '';
  var decryptedLetter
  for(var i = 0; i < ciphertext.length; i++){
    decryptedLetter = Math.pow(letterToNumber(ciphertext[i]), key) % modulus;
    plaintext += numberToLetter(decryptedLetter);
  }
  return plaintext;
}

Identity.prototype.sendMessage = function(plaintext, recipient){
  ciphertext = this.encryptMessage(plaintext, recipient.publicKey, recipient.modulus);
  var signature = this.signMessage(ciphertext);
  recipient.receiveMessage(ciphertext, signature, this);
}

Identity.prototype.receiveMessage = function(ciphertext, signature, sender){
  var authentic = this.confirmAuthenticity(ciphertext, signature, sender.publicKey, sender.modulus);
  if(!authentic){
    console.log('Identity not authenticated');
    return 'Identity not authenticated';
  }
  var plaintext = this.decryptMessage(ciphertext, this.privateKey, this.modulus);
  console.log(plaintext);
  return plaintext;
}

var findCoprime = function(number){
  for(var i = 2; i < number; i++){
    if( determineIfCoprime(i, number) ){
      return i
    }
  }
}

var determineIfCoprime = function(a, b){
  var factorsa = factor(a);
  var factorsb = factor(b);
  delete factorsa[1];
  delete factorsb[1];
  smaller = Object.keys(factorsa) < Object.keys(factorsb) ? factorsa : factorsb;
  larger = Object.keys(factorsa) < Object.keys(factorsb) ? factorsb : factorsa;
  for(var value in smaller){
    if(value in larger) return false
  }
  return true;
}

var factor = function(number){
  primes = {};
  for(var i = 0; i <= Math.sqrt(number); i++){
    if(number % i === 0){
      primes[i] = true;
      primes[number / i] = true;
    }
  }
  primes[number] = true
  return primes
}

calculateModInverse = function(number, mod){
  for(var i = 1; i < mod; i++){
    if(number * i % mod === 1) return i
  }
}

var validLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', ' '];
var extendedLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '`', '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', '[', ']'];
var letterToNumber = function(letter){
  var letters = validLetters.concat(extendedLetters);
  return letters.indexOf(letter);
}

var numberToLetter = function(number){
  var letters = validLetters.concat(extendedLetters);
  return letters[number]
}

alice = new Identity()
bob = new Identity()
alice.generateKeyPair(3, 11);
bob.generateKeyPair(5, 7);
