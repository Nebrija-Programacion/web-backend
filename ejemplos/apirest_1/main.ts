type User = {
    name: string;
    email: string;
  };
  
  let users = [
    { name: "Alberto", email: "avalero@nebrija.es" },
    { name: "José", email: "jetorres@nebrija.es" },
  ];
  
  const handler = async (req: Request): Promise<Response> => {
    const method = req.method;
    const url = new URL(req.url);
    const path = url.pathname;
  
    if (method === "GET") {
      if (path === "/users") {
        const name = url.searchParams.get("name");
        if (!name) return new Response(JSON.stringify(users));
        const filteredUsers = users.filter((u) => u.name === name);
        return new Response(JSON.stringify(filteredUsers));
      } else if (path === "/user") {
        const email = url.searchParams.get("email");
        if (!email) return new Response("Bad request", { status: 400 });
        const user = users.find((u) => u.email === email);
        if (user) return new Response(JSON.stringify(user));
        return new Response("User not found", { status: 404 });
      }
    } else if (method === "POST") {
      if (path === "/user") {
        const user = await req.json();
        if (!user.name || !user.email) {
          return new Response("Bad request", { status: 400 });
        }
        if (users.some((u) => u.email === user.email)) {
          return new Response("Duplicated", { status: 409 });
        }
        users.push({ name: user.name, email: user.email });
        return new Response(JSON.stringify(user), { status: 200 });
      }
    } else if (method === "PUT") {
      const user = await req.json();
      if (!user.name || !user.email) {
        return new Response("Bad request", { status: 400 });
      }
      const userRef = users.find((u) => u.email === user.email);
      if (userRef) userRef.name = user.name;
      else return new Response("User not found", { status: 404 });
  
      return new Response(JSON.stringify(user));
    } else if (method === "DELETE") {
      const user = await req.json();
      if (!user.email) {
        return new Response("Bad request", { status: 400 });
      }
  
      if (!users.some((u) => u.email === user.email)) {
        return new Response("User not found", { status: 404 });
      }
  
      users = users.filter((u) => u.email !== user.email);
      return new Response("OK", { status: 200 });
    }
  
    return new Response("endpoint not found", { status: 404 });
  };
  
  Deno.serve({ port: 3000 }, handler);
  