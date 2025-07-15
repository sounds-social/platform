import assert from "assert";

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
    require('/imports/api/soundsMethods.test.js');
    require('/imports/api/usersMethods.test.js');
    it("server is not client", function () {
      assert.strictEqual(Meteor.isClient, false);
    });
  }
});
