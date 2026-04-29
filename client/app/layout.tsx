import './globals.css';
import { ConfigProvider } from './ConfigContext';
import { NotificationProvider } from './NotificationContext';
import { LocalizationProvider } from './LocalizationContext';
import { AuthProvider } from './AuthContext';

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
        <ConfigProvider>
          <LocalizationProvider>
            <AuthProvider>
              <NotificationProvider>
                <div className="container">
                  {children}
                </div>
              </NotificationProvider>
            </AuthProvider>
          </LocalizationProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
