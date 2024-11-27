import createHash from 'create-hash';


export function ripemd160(buffer: Buffer) {
  try {
    return createHash('ripemd160')
      .update(buffer)
      .digest('hex');
  } catch (err) {
    return createHash('rmd160')
      .update(buffer)
      .digest('hex');
  }
}

export function sha256(buffer: Buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

export function hash160(buffer: Buffer) {
  if (!Buffer.isBuffer(buffer)) {
    throw new TypeError('Expected a buffer');
  }
  console.log('Input buffer:', buffer);
  const sha = sha256(buffer);
  console.log('SHA256 result:', sha);
  const hash160 = ripemd160(Buffer.from(sha, 'hex'));
  console.log('RIPEMD160 result:', hash160);
  return hash160;
}

export default {
  hash160,
  ripemd160,
  sha256,
};
