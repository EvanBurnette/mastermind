import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

const Alert = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Root>
    <AlertDialogPrimitive.Trigger asChild>
      <div ref={ref} className={className} {...props} />
    </AlertDialogPrimitive.Trigger>
  </AlertDialogPrimitive.Root>
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title ref={ref} className={className} {...props} />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description ref={ref} className={className} {...props} />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }