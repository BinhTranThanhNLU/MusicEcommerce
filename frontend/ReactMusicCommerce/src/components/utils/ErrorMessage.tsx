interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <div className="alert alert-danger text-center" role="alert">
      {message}
    </div>
  );
};