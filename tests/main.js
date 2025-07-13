import assert from "assert";
import '/imports/api/soundsMethods.test.js';

describe("sounds-social", function () {
  it("package.json has correct name", async function () {
    const { name } = await import("../package.json");
    assert.strictEqual(name, "sounds-social");
  });

  if (Meteor.isClient) {
    require('/imports/ui/components/Navbar.test.jsx');
    require('/imports/ui/components/SoundList.test.jsx');

    it("client is not server", function () {
      assert.strictEqual(Meteor.isServer, false);
    });
  }

  if (Meteor.isServer) {
    it("server is not client", function () {
      assert.strictEqual(Meteor.isClient, false);
    });
  }
});
