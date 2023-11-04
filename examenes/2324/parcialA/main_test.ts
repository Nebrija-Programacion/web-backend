import mongoose from "npm:mongoose@8.0.0";
import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.205.0/assert/mod.ts";
import { assertExists } from "https://deno.land/std@0.205.0/assert/assert_exists.ts";

const MONGO_URL = Deno.env.get("MONGO_URL_TEST");
const DB = Deno.env.get("DB") || "contactosTest";
const API_URL = Deno.env.get("API_URL") || "http://localhost:6000";
const COLLECTION = "contacts";
if (!MONGO_URL) {
  throw new Error("Please provide a MONGO_URL");
  Deno.exit(-1);
}

// connecto to MongoDB
const uri = `${MONGO_URL}/${DB}?retryWrites=true&w=majority`;
await mongoose.connect(uri);
console.info("MongoDB connected");

const clearContactCollection = async () => {
  // check if Contact Colletion exists
  const collections = await mongoose.connection.db.listCollections().toArray();
  if (collections.some((collection) => collection.name === COLLECTION)) {
    await mongoose.connection.db.dropCollection(COLLECTION);
  }
  // create Contact Collection
  await mongoose.connection.db.createCollection(COLLECTION);
};

type PushContact = {
  dni: string;
  name: string;
  email: string;
  cp: string;
  isoCountryCode: string;
};

const pushContact = async (contact: PushContact) => {
  const response = await fetch(`${API_URL}/api/contactos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contact),
  });
  const data = await response.json();
  return data;
};

const putContact = async (dni: string, contact: Partial<PushContact>) => {
  const response = await fetch(`${API_URL}/api/contactos/${dni}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contact),
  });
  const data = await response.json();
  return data;
};

const deleteContact = async (dni: string) => {
  const response = await fetch(`${API_URL}/api/contactos/${dni}`, {
    method: "DELETE",
  });
  const data = await response.json();
  return data;
};

const getContactFromDNI = async (dni: string) => {
  const response = await fetch(`${API_URL}/api/contactos/${dni}`);
  const data = await response.json();
  return data;
};

const getAllContacts = async () => {
  const response = await fetch(`${API_URL}/api/contactos`);
  const data = await response.json();
  return data;
};

Deno.test({
  name: "Test pushContact",
  fn: async () => {
    await clearContactCollection();

    const data = await pushContact({
      dni: "12345678A",
      name: "John Doe",
      email: "john.doe@email.com",
      cp: "28001",
      isoCountryCode: "ES",
    });

    assertEquals(data.dni, "12345678A");
    assertEquals(data.name, "John Doe");
    assertEquals(data.email, "john.doe@email.com");
    assertEquals(data.cp, "28001");
    assertEquals(data.isoCountryCode, "ES");

    // check if contact is in database
    const contact = await mongoose.connection.db
      .collection(COLLECTION)
      .findOne({
        dni: "12345678A",
      });
    if (!contact) {
      throw new Error("Contact not found");
    }
    assertEquals(contact.dni, "12345678A");
    assertEquals(contact.name, "John Doe");
    assertEquals(contact.cp, "28001");
    assertEquals(contact.isoCountryCode, "ES");
    assertEquals(contact.country, "Spain");
    assertEquals(contact.city, "Madrid");
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "Test pushContact - DNI exists",
  fn: async () => {
    await clearContactCollection();

    await pushContact({
      dni: "12345678A",
      name: "John Doe",
      email: "john.doe@email.com",
      cp: "28001",
      isoCountryCode: "ES",
    });

    const data = await pushContact({
      dni: "12345678A",
      name: "John Doe 2",
      email: "john.doe2@email.com",
      cp: "28001",
      isoCountryCode: "ES",
    });

    assertEquals(data.message, "Contact already exists");

    // check there is only one contact in DDBB
    const contacts = await mongoose.connection.db
      .collection(COLLECTION)
      .find()
      .toArray();
    assertEquals(contacts.length, 1);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "Test pushContact - Wrong CP",
  fn: async () => {
    await clearContactCollection();

    const data = await pushContact({
      dni: "12345678A",
      name: "John Doe",
      email: "john.doe@email.com",
      cp: "99999",
      isoCountryCode: "ES",
    });

    assertEquals(data.error, "Invalid zip or country code");

    // check if contact is in database
    const contact = await mongoose.connection.db
      .collection(COLLECTION)
      .findOne({
        dni: "12345678A",
      });
    assertEquals(contact, null);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "Test pushContact - Wrong ISO Country Code",
  fn: async () => {
    await clearContactCollection();

    const data = await pushContact({
      dni: "12345678A",
      name: "John Doe",
      email: "john.doe@email.com",
      cp: "28030",
      isoCountryCode: "ESP",
    });

    assertEquals(data.error, "Invalid zip or country code");

    // check if contact is in database
    const contact = await mongoose.connection.db
      .collection(COLLECTION)
      .findOne({
        dni: "12345678A",
      });
    assertEquals(contact, null);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "Test putContact - only name changes",
  fn: async () => {
    await clearContactCollection();

    // create contact
    await pushContact({
      dni: "12345678A",
      name: "John Doe",
      email: "john.doe@mail.com",
      cp: "28001",
      isoCountryCode: "ES",
    });

    // update contact
    const data = await putContact("12345678A", {
      name: "John Doe 2",
    });

    assertEquals(data.dni, "12345678A");
    assertEquals(data.name, "John Doe 2");
    assertEquals(data.email, "john.doe@mail.com");
    assertEquals(data.cp, "28001");
    assertEquals(data.isoCountryCode, "ES");

    // check if contact is in database
    const contact = await mongoose.connection.db
      .collection(COLLECTION)
      .findOne({
        dni: "12345678A",
      });
    if (!contact) {
      throw new Error("Contact not found");
    }
    assertEquals(contact.dni, "12345678A");
    assertEquals(contact.name, "John Doe 2");
    assertEquals(contact.cp, "28001");
    assertEquals(contact.isoCountryCode, "ES");
    assertEquals(contact.country, "Spain");
    assertEquals(contact.city, "Madrid");
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "Test putContact - cp changes",
  fn: async () => {
    await clearContactCollection();

    // create contact
    await pushContact({
      dni: "12345678A",
      name: "John Doe",
      email: "john.doe@mail.com",
      cp: "28001",
      isoCountryCode: "ES",
    });

    // update contact
    const data = await putContact("12345678A", {
      name: "John Doe 2",
      cp: "28250",
    });

    assertEquals(data.dni, "12345678A");
    assertEquals(data.name, "John Doe 2");
    assertEquals(data.email, "john.doe@mail.com");
    assertEquals(data.cp, "28250");
    assertEquals(data.isoCountryCode, "ES");

    // check if contact is in database
    const contact = await mongoose.connection.db
      .collection(COLLECTION)
      .findOne({
        dni: "12345678A",
      });
    if (!contact) {
      throw new Error("Contact not found");
    }
    assertEquals(contact.dni, "12345678A");
    assertEquals(contact.name, "John Doe 2");
    assertEquals(contact.cp, "28250");
    assertEquals(contact.isoCountryCode, "ES");
    assertEquals(contact.country, "Spain");
    assertEquals(contact.city, "Galapagar");
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "Test putContact - isoCountryCode changes",
  fn: async () => {
    await clearContactCollection();

    // create contact
    await pushContact({
      dni: "12345678A",
      name: "John Doe",
      email: "john.doe@mail.com",
      cp: "28001",
      isoCountryCode: "ES",
    });

    // update contact
    const data = await putContact("12345678A", {
      name: "John Doe 2",
      isoCountryCode: "US",
    });

    assertEquals(data.dni, "12345678A");
    assertEquals(data.name, "John Doe 2");
    assertEquals(data.email, "john.doe@mail.com");
    assertEquals(data.cp, "28001");
    assertEquals(data.isoCountryCode, "US");

    // check if contact is in database
    const contact = await mongoose.connection.db
      .collection(COLLECTION)
      .findOne({
        dni: "12345678A",
      });
    if (!contact) {
      throw new Error("Contact not found");
    }
    assertEquals(contact.dni, "12345678A");
    assertEquals(contact.name, "John Doe 2");
    assertEquals(contact.cp, "28001");
    assertEquals(contact.isoCountryCode, "US");
    assertEquals(contact.country, "United States of America");
    assertEquals(contact.city, "Albemarle");
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "Test putContact - dni does not exist",
  fn: async () => {
    await clearContactCollection();

    // update contact
    const data = await putContact("12345678B", {
      name: "John Doe 2",
    });

    assertEquals(data.message, "Contact not found");
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "Delete contact",
  fn: async () => {
    await clearContactCollection();

    // create contact
    await pushContact({
      dni: "12345678A",
      name: "John Doe",
      email: "john.doe#mail.com",
      cp: "28001",
      isoCountryCode: "ES",
    });

    // delete contact
    const data = await deleteContact("12345678A");

    assertEquals(data.message, "Contact deleted");
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "Delete contact - dni does not exists",
  fn: async () => {
    await clearContactCollection();

    // create contact
    await pushContact({
      dni: "12345678A",
      name: "John Doe",
      email: "john.doe#mail.com",
      cp: "28001",
      isoCountryCode: "ES",
    });

    // delete contact
    const data = await deleteContact("12345678B");
    assertEquals(data.message, "Contact not found");
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "Get contact from DNI",
  fn: async () => {
    await clearContactCollection();

    // create contact
    await pushContact({
      dni: "12345678A",
      name: "John Doe",
      email: "john.doe#mail.com",
      cp: "28001",
      isoCountryCode: "ES",
    });

    // get contact
    const data = await getContactFromDNI("12345678A");

    assertEquals(data.dni, "12345678A");
    assertEquals(data.name, "John Doe");
    assertEquals(data.email, "john.doe#mail.com");
    assertEquals(data.cp, "28001");
    assertEquals(data.isoCountryCode, "ES");
    assertExists(data.localTime);
    assertExists(data.weather);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "Get contact from DNI - dni does not exists",
  fn: async () => {
    await clearContactCollection();

    // create contact
    await pushContact({
      dni: "12345678A",
      name: "John Doe",
      email: "john.doe#mail.com",
      cp: "28001",
      isoCountryCode: "ES",
    });

    // get contact
    const data = await getContactFromDNI("12345678B");
    assertEquals(data.message, "Contact not found");
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "Get all contacts",
  fn: async () => {
    await clearContactCollection();

    // create contact
    await pushContact({
      dni: "12345678A",
      name: "John Doe",
      email: "john.doe@mail.com",
      cp: "28001",
      isoCountryCode: "ES",
    });

    await pushContact({
      dni: "12345678B",
      name: "John Doe 2",
      email: "john.doe2@mail.com",
      cp: "28001",
      isoCountryCode: "ES",
    });

    // get contact
    const data = await getAllContacts();

    assertEquals(data.length, 2);
    assertEquals(data[0].dni, "12345678A");
    assertEquals(data[0].name, "John Doe");
    assertEquals(data[1].dni, "12345678B");
    assertEquals(data[1].name, "John Doe 2");
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
