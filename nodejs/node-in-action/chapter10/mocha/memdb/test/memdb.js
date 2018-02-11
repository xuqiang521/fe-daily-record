var memdb = require('..');
var assert = require('assert');

describe('memdb', function() {
  beforeEach(function() {
    memdb.clear();
  })

  describe('.save(doc)', function() {
    it('should save the document', function() {
      var pet = { name: 'Tobi' };
      memdb.save(pet);
      var ret = memdb.first({ name: 'Tobi' });
      assert(ret === pet)
    })
    
    it('should save the document async', function() {
      var pet = { name: 'Tobi' };
      memdb.save(pet, function() {
        var ret = memdb.first({ name: 'Tobi' });
        assert(ret === pet);
        done();
      });
    })
  })

  describe('.first(obj)', function() {
    it('should return thr first matching doc', function() {
      var tobi = { name: 'Tobi' };
      var loki = { name: 'Loki' };
      
      memdb.save(tobi);
      memdb.save(loki);

      var ret = memdb.first({ name: 'Tobi' });
      assert(ret === tobi);

      var ret = memdb.first({ name: 'Loki' });
      assert(ret === loki);
    })

    it('should return null when no doc matches', function() {
      var ret = memdb.first({ name: 'Manny' });
      assert(ret == null)
    })

  })

})