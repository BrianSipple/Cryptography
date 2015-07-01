var Identity = function(){
  this.privateKey = null;
  this.publicKey = null;
  this.modulus = null;
};

Identity.prototype.generateKeyPair = function(p, q){
  /* Should calculate the private and public key, and store them on the Identity */
  this.modulus = p * q;
  var phi = (p - 1) * (q - 1);
  this.publicKey = findCoprime(phi);
  this.privateKey = calculateModInverse(this.publicKey, phi);

};

/**
 * Generate a signature as the text encrypted with the SENDER's private_key/modulus pair
 */
Identity.prototype.signMessage = function(text){
  /* Given text, generate and return the senders signature */
  return encryptMessage(text, this.privateKey, this.modulus);
};

Identity.prototype.sendMessage = function(plaintext, recipient){
  /* Given plaintext and a recipient, sendMessage should follow all the necessary protocols for it to be securely sent, and then send the message */
  /* (Hint: look at receiveMessage) */
  var ciphertext = encryptMessage(plaintext, recipient.publicKey, recipient.modulus),
      signature = this.signMessage(ciphertext);

  recipient.receiveMessage(ciphertext, signature, this);
  return {signature: signature, ciphertext: ciphertext, sender: this };
};

Identity.prototype.receiveMessage = function(ciphertext, signature, sender){
  /* Given the ciphertext, signature, and sender, receiveMessage should determine the integrity of the message and selectively read and return the content. */
  if ( confirmAuthenticity(ciphertext, signature, sender.publicKey, sender.modulus) ) {
    return decryptMessage(ciphertext, this.privateKey, this.modulus);

  } else {
    var errorMsg = 'Identity not authenticated';
    console.log(errorMsg);
    return errorMsg;
  }
};

var encryptMessage = function(plaintext, key, modulus){
  /* Should turn plaintext into ciphertext according to the RSA protocol and return it */
  var ciphertext = '',
    encryptedNumber;
  for (var i = 0, l = plaintext.length; i < l; i++) {
    encryptedNumber = Math.pow(letterToNumber(plaintext[i]), key) % modulus;
    ciphertext += numberToLetter(encryptedNumber);
  }
  return ciphertext;
};

var decryptMessage = function(ciphertext, key, modulus){
  /* Should turn ciphertext into plaintext according to the RSA protocol and return it */
  var decrytedText = '',
      decrytedNumber;
  for (var i = 0, l = ciphertext.length; i < l; i++) {
    decrytedNumber = Math.pow(letterToNumber(ciphertext[i]), key) % modulus;
    decrytedText += numberToLetter(decrytedNumber);
  }
  return decrytedText;
};

var confirmAuthenticity = function(ciphertext, signature, key, modulus){
  /* Should confirm that the sender is who they claim to be */
  var decryptedSig = decryptMessage(signature, key, modulus);
  return decryptedSig === ciphertext;
};

/*******************************************/
// It's dangerous to go alone!  Take these!//
//           HELPER FUNCTIONS              //
//           (do not modify)               //
/*******************************************/
var letterToNumber = function(letter){
  return letters.indexOf(letter);
};

var numberToLetter = function(number){
  if(number >= letters.length){
    number = number % letters.length; // TODO
  } else {
  }
  return letters[number];
};
var findCoprime = function(number){
  for(var i = 2; i < number; i++){
    if( determineIfCoprime(i, number) ){
      return i
    }
  }
};

/*******************************************/
//        HELPER HELPER FUNCTIONS          //
//        (you won't use these)            //
//           (do not modify)               //
/*******************************************/
var determineIfCoprime = function(a, b){
  var factorsa = factor(a);
  var factorsb = factor(b);
  delete factorsa[1];
  delete factorsb[1];
  var smaller = Object.keys(factorsa) < Object.keys(factorsb) ? factorsa : factorsb;
  var larger = Object.keys(factorsa) < Object.keys(factorsb) ? factorsb : factorsa;
  for(var value in smaller){
    if(value in larger) return false
  }
  return true;
};

var factor = function(number){
  var primes = {};
  for(var i = 0; i <= Math.sqrt(number); i++){
    if(number % i === 0){
      primes[i] = true;
      primes[number / i] = true;
    }
  }
  primes[number] = true
  return primes
};

calculateModInverse = function(number, mod){
  for(var i = 1; i < mod; i++){
    if(number * i % mod === 1) return i
  }
};

var validLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', ' '];
var extendedLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '`', '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', '[', ']'];
var letters = validLetters.concat(extendedLetters)
