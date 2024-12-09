import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "../../components/ui/alert"; // Import the components from ShadCN

interface GeneralAlertProps {
  type: "success" | "error"; // Type determines if it's success or error
  message: string; // The message to display
  children?: React.ReactNode; // Children to display
}

const GeneralAlert: React.FC<GeneralAlertProps> = ({ type, message, children }) => {
  // Determine ShadCN variant and background color based on 'type'
  const variant = type === "error" ? "destructive" : "default"; // 'destructive' is used for error

  return (
    <Alert
      variant={variant}
      dir="rtl"
      className="bg-opacity-90 flex gap-2 py-1 px-1 bg-red-100 items-center rounded-md "
      lang="ar"
    >
      {/* Show the icon based on success or error */}
      <div>
        {type === "success" ? <CheckCircle /> : <AlertCircle></AlertCircle>}
      </div>
      <div>
        <AlertDescription className="flex gap-1 items-center">
          <span>{message}</span>
          {!children ? "." : "،"}
          <span>
            {children}
          </span>
        </AlertDescription>
      </div>
    </Alert>
  );
};

export default GeneralAlert;
