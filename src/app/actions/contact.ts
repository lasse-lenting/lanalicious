"use server";

export async function submitContactForm(formData: FormData) {
  const name = formData.get("voornaam");
  const surname = formData.get("achternaam");
  const email = formData.get("email");
  const message = formData.get("bericht");

  // Validate required fields
  if (!name || !surname || !email || !message) {
    return {
      success: false,
      message: "Alle velden zijn verplicht",
    };
  }

  // Add your Web3Forms access key from environment variable
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    return {
      success: false,
      message: "Configuratiefout. Neem contact op met de beheerder.",
    };
  }

  // Prepare form data for Web3Forms
  const web3FormsData = new FormData();
  web3FormsData.append("access_key", accessKey);
  web3FormsData.append("name", `${name} ${surname}`);
  web3FormsData.append("email", email as string);
  web3FormsData.append("message", message as string);

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: web3FormsData,
    });

    const data = await response.json();

    if (data.success) {
      return {
        success: true,
        message: "Bedankt voor uw bericht! We nemen zo spoedig mogelijk contact met u op.",
      };
    } else {
      return {
        success: false,
        message: data.message || "Er is iets misgegaan. Probeer het opnieuw.",
      };
    }
  } catch (error) {
    console.error("Form submission error:", error);
    return {
      success: false,
      message: "Er is een fout opgetreden. Probeer het later opnieuw.",
    };
  }
}

