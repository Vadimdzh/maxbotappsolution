import crypto from 'crypto';

export function validateAndParseInitData(initData, botToken) {
  console.log('validation started');
  if (!initData || !botToken) {
    return { valid: false };
  }
  console.log('validation step first - success');
  const decoded = decodeURIComponent(initData);
  const params = new URLSearchParams(decoded);

  const entries = [];
  let receivedHash = '';
  for (const [key, value] of params.entries()) {
    if (key === 'hash') {
      receivedHash = value;
    } else {
      entries.push({ key, value });
    }
  }

  entries.sort((a, b) => a.key.localeCompare(b.key));
  const dataCheckString = entries.map((entry) => `${entry.key}=${entry.value}`).join('\n');

  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
  const computedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  console.log(computedHash)
  if (computedHash !== receivedHash) {
    return { valid: false };
  }


  const rawData = Object.fromEntries(entries.map((entry) => [entry.key, entry.value]));
  let user = null;
  try {
    user = rawData.user ? JSON.parse(rawData.user) : null;
  } catch {
    user = null;
  }

  return {
    valid: true,
    user,
    authDate: rawData.auth_date ? Number(rawData.auth_date) : null,
    queryId: rawData.query_id ?? null,
    rawData,
  };
}
