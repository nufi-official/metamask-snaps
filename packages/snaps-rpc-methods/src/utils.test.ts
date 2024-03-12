import { SIP_6_MAGIC_VALUE } from '@metamask/snaps-utils';
import { TEST_SECRET_RECOVERY_PHRASE_BYTES } from '@metamask/snaps-utils/test-utils';

import { ENTROPY_VECTORS } from './__fixtures__';
import { deriveEntropy, getNode, getPathPrefix } from './utils';

describe('deriveEntropy', () => {
  it.each(ENTROPY_VECTORS)(
    'derives entropy from the given parameters',
    async ({ snapId, salt, entropy }) => {
      expect(
        await deriveEntropy({
          input: snapId,
          salt,
          mnemonicPhrase: TEST_SECRET_RECOVERY_PHRASE_BYTES,
          magic: SIP_6_MAGIC_VALUE,
        }),
      ).toStrictEqual(entropy);
    },
  );
});

describe('getPathPrefix', () => {
  it('returns "bip32" for "secp256k1"', () => {
    expect(getPathPrefix('secp256k1')).toBe('bip32');
  });

  it('returns "slip10" for "ed25519"', () => {
    expect(getPathPrefix('ed25519')).toBe('slip10');
  });
});

describe('getNode', () => {
  it('returns a secp256k1 node', async () => {
    const node = await getNode({
      curve: 'secp256k1',
      path: ['m', "44'", "1'"],
      secretRecoveryPhrase: TEST_SECRET_RECOVERY_PHRASE_BYTES,
    });

    expect(node).toMatchInlineSnapshot(`
      {
        "chainCode": "0x50ccfa58a885b48b5eed09486b3948e8454f34856fb81da5d7b8519d7997abd1",
        "curve": "secp256k1",
        "depth": 2,
        "index": 2147483649,
        "masterFingerprint": 1404659567,
        "parentFingerprint": 1829122711,
        "privateKey": "0xc73cedb996e7294f032766853a8b7ba11ab4ce9755fc052f2f7b9000044c99af",
        "publicKey": "0x048e129862c1de5ca86468add43b001d32fd34b8113de716ecd63fa355b7f1165f0e76f5dc6095100f9fdaa76ddf28aa3f21406ac5fda7c71ffbedb45634fe2ceb",
      }
    `);
  });

  it('returns an ed25519 node', async () => {
    const node = await getNode({
      curve: 'ed25519',
      path: ['m', "44'", "1'"],
      secretRecoveryPhrase: TEST_SECRET_RECOVERY_PHRASE_BYTES,
    });

    expect(node).toMatchInlineSnapshot(`
      {
        "chainCode": "0xcecf799c541108016e8febb5956379533702574d509b52e1078df95fbc6ae054",
        "curve": "ed25519",
        "depth": 2,
        "index": 2147483649,
        "masterFingerprint": 650419359,
        "parentFingerprint": 4080844380,
        "privateKey": "0x9dee85af06f9b94d2451549f5a9b0a3bbba9e2513daebc793ca5c9a13e80cafa",
        "publicKey": "0x00c9aaf347832dc3b1dbb7aab4f41e5e04c64446b819c0761571c27b9f90eacb27",
      }
    `);
  });

  it('returns an ed25519Bip32 node', async () => {
    const node = await getNode({
      curve: 'ed25519Bip32',
      path: ['m', "1852'", "1815'"],
      secretRecoveryPhrase: TEST_SECRET_RECOVERY_PHRASE_BYTES,
    });

    expect(node).toMatchInlineSnapshot(`
      {
        "chainCode": "0x4008460bcab45542b91b5d0c2815b3b2543432d18f4e61911c09197cb2c61333",
        "curve": "ed25519Bip32",
        "depth": 2,
        "index": 2147485463,
        "masterFingerprint": 1587894111,
        "parentFingerprint": 3947345764,
        "privateKey": "0x302f663588ebab9e2c357045bd141325c1639761d616080a3e2aa313e2bc734ef63612dba17778c957a321291c5e77e80ffb4fe233b491e931f9a1de7ae550e6",
        "publicKey": "0x14029ae278dff12653d0dec3dc0d843c40cc5301c768806e3d112f22c9f3611f",
      }
    `);
  });
});
