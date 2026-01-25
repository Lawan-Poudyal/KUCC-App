import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Asset } from "expo-asset";

export async function generateCertificate(name, event) {
  const logoAsset = Asset.fromModule(
    require("../assets/kucc-logo.png")
  );
  await logoAsset.downloadAsync();

  const html = `
    <html>
      <body style="
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: 'Times New Roman';
        background: #fff;
      ">
        <div style="
          width: 900px;
          height: 600px;
          border: 12px solid #3C3F8F;
          padding: 50px;
          text-align: center;
          box-sizing: border-box;
        ">
          
          <img src="${logoAsset.uri}" style="width: 120px; margin-bottom: 20px;" />

          <h1 style="font-size: 42px; margin-bottom: 20px;">
            Certificate of Participation
          </h1>

          <p style="font-size: 18px;">This is proudly presented to</p>

          <h2 style="
            font-size: 36px;
            margin: 20px 0;
            font-weight: bold;
          ">
            ${name}
          </h2>

          <p style="font-size: 18px;">
            for successfully participating in
          </p>

          <h3 style="font-size: 28px; margin-top: 10px;">
            ${event}
          </h3>

          <p style="margin-top: 50px; font-size: 16px;">
            KUCC · Kathmandu University
          </p>

          <p style="font-size: 14px;">
            Issued on ${new Date().toDateString()}
          </p>

        </div>
      </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({ html });
  return uri;
}
