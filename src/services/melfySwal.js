import Swal from "sweetalert2";

export default async function MelfySwal(optionsOrTitle, text, icon) {
  let finalOptions = {};

  if (typeof optionsOrTitle === "object" && optionsOrTitle !== null) {
    finalOptions = { ...optionsOrTitle };
  } else {
    finalOptions = {
      title: optionsOrTitle,
      text: text,
      icon: icon,
    };
  }

  const melfyDefaults = {
    customClass: {
      popup: "melfy-swal-popup",
      title: "melfy-swal-title",
      htmlContainer: "melfy-swal-text",
      confirmButton: "melfy-swal-confirm-btn",
      cancelButton: "melfy-swal-cancel-btn",
    },
    buttonsStyling: true,
    confirmButtonColor: "#FFC43D", 
    cancelButtonColor: "#c53030",
  };

  const swalOptions = {
    ...melfyDefaults,
    ...finalOptions,
    customClass: {
      ...melfyDefaults.customClass,
      ...(finalOptions.customClass || {}),
    },
  };

  return Swal.fire(swalOptions);
}
