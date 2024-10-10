import m from "mithril";

const CalibrationButton = {
  view({ attrs }) {
    const { className, label, action, onSuccess, onError, isLoading, isDisabled } = attrs;

    const handleClick = async () => {
      if (isLoading || isDisabled) return;

      try {
        const response = await action();
        if (response.status === "success") {
          onSuccess && onSuccess(response);
        } else {
          onError && onError(`Failed: ${response.message || "Unknown error"}`);
        }
      } catch (error) {
        onError && onError(`Error: ${error.message}`);
      }
    };

    return m(
      "button",
      {
        class: `button ${className} ${isLoading ? "is-loading" : ""}`,
        onclick: handleClick,
        disabled: isDisabled || isLoading,
      },
      label
    );
  },
};

export default CalibrationButton;
