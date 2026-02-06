exports.welcomeUser = ({ full_name, user_id }) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Welcome to SplitPay</title>
  </head>

  <body style="
    margin:0;
    padding:0;
    background:#0f0f0f;
    font-family: 'Ubuntu', Arial, sans-serif;
  ">
    <div style="
      max-width:600px;
      margin:40px auto;
      background:#181818;
      border-radius:14px;
      box-shadow:0 10px 30px rgba(0,0,0,0.4);
      overflow:hidden;
      color:#ffffff;
    ">

      <!-- Header -->
      <div style="
        background:linear-gradient(135deg,#ff4d4d,#ff1f1f);
        padding:22px;
        text-align:center;
      ">
        <h2 style="margin:0;font-weight:600;letter-spacing:0.5px;">
          Welcome to SplitPay 🎉
        </h2>
      </div>

      <!-- Body -->
      <div style="
        padding:26px;
        font-size:14px;
        line-height:1.7;
        color:#e5e5e5;
      ">
        <p>Hey <strong>${full_name}</strong> 👋</p>

        <p>
          Your SplitPay account has been successfully created.
          You’re now ready to split expenses with friends, roommates,
          and groups — without awkward math 😄
        </p>

        <table style="
          margin:18px 0;
          font-size:14px;
          border-collapse:collapse;
        ">
          <tr>
            <td style="padding:6px 14px 6px 0;color:#bbbbbb;">
              <strong>User ID</strong>
            </td>
            <td style="color:#ffffff;">
              ${user_id}
            </td>
          </tr>
        </table>

        <p>
          Keep this User ID safe — it’ll help you manage groups and
          access your account smoothly.
        </p>

        <div style="text-align:center;margin:28px 0;">
          <a href="https://splitpay.app/login"
            style="
              display:inline-block;
              padding:14px 30px;
              background:linear-gradient(135deg,#ff4d4d,#ff1f1f);
              color:#ffffff;
              text-decoration:none;
              border-radius:10px;
              font-weight:600;
            ">
            Go to Dashboard →
          </a>
        </div>

        <p>
          Need help or got questions? Just reply to this email —
          we’ve got your back.
        </p>

        <p style="margin-top:26px;">
          Cheers,<br />
          <strong>Team SplitPay</strong>
        </p>
      </div>

      <!-- Footer -->
      <div style="
        background:#121212;
        padding:14px;
        text-align:center;
        font-size:12px;
        color:#9a9a9a;
      ">
        © ${new Date().getFullYear()} SplitPay. All rights reserved.<br />
        Smart splits. Zero stress.
      </div>

    </div>
  </body>
  </html>
  `;
};
