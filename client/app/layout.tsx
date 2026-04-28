import './globals.css';
import { ConfigProvider } from './ConfigContext';
import { NotificationProvider } from './NotificationContext';

export const metadata = {
  title: 'Aether | Dynamic App Generator',
  description: 'Deploy web apps from JSON',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NotificationProvider>
          <ConfigProvider>
            <div className="container">
              {children}
            </div>
          </ConfigProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
