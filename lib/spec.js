var expect = chai.expect;

describe('asymmetric key encryption', function(){
  context('generateKeyPair', function(){
    it('generates the modulus', function(){
      var alice = new Identity();
      alice.generateKeyPair(3, 11);
      expect(alice.modulus).to.equal(33);
    });
    it('generates the public key', function(){
      var alice = new Identity();
      alice.generateKeyPair(3, 11);
      expect(alice.publicKey).to.equal(3);
    });
    it('generates the private key', function(){
      var alice = new Identity();
      alice.generateKeyPair(3, 11);
      expect(alice.privateKey).to.equal(7);
    });
  });
  context('encryptMessage', function(){
    it('returns cyphertext for given plaintext', function(){
      var alice = new Identity();
      var encryptedMessage = alice.encryptMessage('secret message', 7, 33);
      expect(encryptedMessage).to.equal('gqCiqnfmqggaDq');
    });
    it('returns different cyphertext for different keys', function(){
      var alice = new Identity();
      var encryptedMessage1 = alice.encryptMessage('secret message', 7, 33);
      var encryptedMessage2 = alice.encryptMessage('secret message', 3, 33);
      expect(encryptedMessage1).not.to.equal(encryptedMessage2);
    });
  });
  context('signMessage', function(){
    it('returns an encrypted version of the message', function(){
      var alice = setupIdentity(7, 3, 33);
      var message = 'hello world';
      var signedMessage = alice.signMessage(message);
      expect(signedMessage).to.equal('Bqllufwuilj');
    });
    it('public key-encrypted messages cannot be decrypted by public key', function(){
      var alice = new Identity();
      var message = 'hello world';
      var encryptedMessage = alice.encryptMessage(message, 3, 33);
      expect(alice.decryptMessage(encryptedMessage, 3, 33)).not.to.equal(message);
    });
  });
  context('confirmAuthenticity', function(){
    it('returns true when text matches decrypted message for a given set of keys', function(){
      var alice = setupIdentity(7, 3, 33);
      var bob = setupIdentity(29, 5, 91);
      var message = 'hello world';
      var signedMessage = alice.signMessage(message); // todo actually provide fake signedMessage
      expect(bob.confirmAuthenticity(message, signedMessage, alice.publicKey, alice.modulus)).to.be.true;
    });
    it('returns false when text does not match decrypted message for a given set of keys', function(){
      var alice = setupIdentity(7, 3, 33);
      var bob = setupIdentity(29, 5, 91);
      var message = 'hello world';
      var signedMessage = alice.signMessage(message);
      expect(bob.confirmAuthenticity(message, signedMessage, bob.publicKey, bob.modulus)).to.be.false;
    });
  });
  context('decryptMessage', function(){
    it('returns plaintext for given cyphertext', function(){
      var alice = new Identity();
      var encryptedMessage = alice.encryptMessage('secret message', 7, 33);
      expect(encryptedMessage).to.equal('gqCiqnfmqggaDq');
      var bob = new Identity();
      expect(bob.decryptMessage(encryptedMessage, 3, 33)).to.equal('secret message');
    });
  });
  context('sendMessage', function(){
    it('returns plaintext for given cyphertext', function(){
      var spy = sinon.spy(Identity.prototype, 'receiveMessage');
      var alice = setupIdentity(7, 3, 33);
      var bob = setupIdentity(29, 5, 91);
      var message = 'my secret message';
      alice.sendMessage(message, bob);
      expect(spy.called).to.be.true;
      Identity.prototype.receiveMessage.restore();
    });
  });
  context('receiveMessage', function(){
    it('returns \'Identity not authenticated\' if cannot confirmAuthenticity', function(){
      var alice = setupIdentity(7, 3, 33);
      var bob = new Identity();
      var response = bob.receiveMessage('blahblah', 'something different', alice);
      expect(response).to.equal('Identity not authenticated');
    });
    it('returns plaintext for given cyphertext', function(){
      var alice = setupIdentity(7, 3, 33); //3,11
      var bob = setupIdentity(77, 5, 119); //7,17
      var plaintext = 'secret message';
      // console.log('send', alice.encryptMessage(plaintext, bob.publicKey, bob.modulus));
      // console.log('resp', bob.decryptMessage('f*F$*@7d*ffaO*', bob.privateKey, bob.modulus));
      var sent = alice.sendMessage(plaintext, bob);
      expect(bob.receiveMessage(sent.ciphertext, sent.signature, alice)).to.equal(plaintext);

      // var spy = sinon.spy(Identity.prototype, 'receiveMessage');
      // var alice = setupIdentity(7, 3, 33);
      // var bob = setupIdentity(29, 5, 91);
      // var message = 'hello world';
      // alice.sendMessage(message, bob);
      // expect(spy.args[0][0]).to.be.true;
      // Identity.prototype.receiveMessage.restore();
    });
  });
});

function setupIdentity (v, u, d) {
  var a = new Identity();
  a.privateKey = v;
  a.publicKey = u;
  a.modulus = d;
  return a;
};