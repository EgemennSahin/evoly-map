import { PopupModal } from "react-calendly";

export default function CalendlyPopup({ ...props }) {
  return (
    <PopupModal
      url={props.url}
      rootElement={document.getElementById("root") as HTMLElement}
      open={props.open}
      onModalClose={props.onModalClose}
      prefill={props.prefill}
    />
  );
}
