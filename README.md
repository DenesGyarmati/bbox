Készíts egy webes alkalmazást, ahol:
• Szervezők eseményeket hozhatnak létre, kezelhetik a jegykeretet.
• Felhasználók böngészhetnek eseményeket, jegyet foglalhatnak.
• Admin teljes szerepkörrel rendelkezik, minden adatot elér.

Architektúra
•     Monorepo:
•     apps/backend – REST API
•     apps/frontend – web kliens (React/Next vagy Vue/Nuxt vagy SvelteKit vagy Angular)
•     PostgreSQL - db migrációval
•     Docker Compose indítja: api, web, postgres.
•     .env.example mindhárom komponenshez.

Szerepkörök és jogosultságok
•     admin: összes entitás listázása/megtekintése, felhasználók tiltása/engedélyezése.
•     organizer: saját eseményei CRUD, jegykeret beállítása.
•     user: események böngészése, jegyfoglalás. (regisztráció nem kötelező, lehetnek előre felvett userek)
•     auth: e-mail + jelszó (hash), session vagy JWT; kijelentkezés.
•     Frontenden role-guardolt menük/route-ok.

Funkcionális követelmények

Események
• Mezők: title, description, startsAt, location, capacity, opcionális category, status (draft/published/cancelled).
• Keresés/szűrés: cím/részlet + helyszín + kategória, szerveroldali pagináció.
• Publikálás: csak published esemény foglalható.

Jegyfoglalás
• Egy felhasználó eseményenként max. 5 jegyet foglalhat (paraméterezhető).
• Tranzakciós készletkezelés: foglaláskor az esemény remainingSeats = capacity - sum(confirmed bookings) nem mehet 0 alá, versenyhelyzetben sem.
• Siker esetén visszaad: bookingId, quantity, totalPrice (ha van ármező), időbélyeg.
• Saját foglalások listázása.

Admin funkciók
• Felhasználók listázása; isBlocked állítás.
• Események/ foglalások átnézése.

Nem funkcionális
• Biztonság: input validáció, titkok ne kerüljenek repóba, 500-asok ne szivárogtassanak stack-trace-t.
• Teljesítmény: pagináció; indexek; N+1 elkerülése.
• Loggolás: strukturált (JSON), legalább INFO/ERROR.
• docker-compose up után induljon minden; rövid, lényegre törő README.

• Login oldal + szerepkör szerinti navigáció.
• Eseménylista: keresés, szűrés, pagináció; csak published esemény látszik usernek.
• Esemény részletek: foglalási mennyiség választása, beküldés, hibák kulturált megjelenítése.
• Organizer nézet: saját események listája, szerkesztés, publikálás, kapacitás.
• Admin nézet: felhasználók listája, tiltás/engedélyezés (min. állapot kapcsoló).

DevOps / futtatás
• docker-compose.yml (példa szolgáltatások):
• db: postgres (14+), init script/healthcheck.
• api: a backend; várja, hogy a DB éljen; migrációk lefutnak induláskor vagy külön parancsban.
• web: a frontend; .env-ből kap API URL-t.
• README tartalmazza:
• indítás (docker compose up -d vagy make dev),
• seed felhasználók (pl. admin@eventhub.local / Admin123!, org@eventhub.local / Org123!, user@eventhub.local / User123!),
• elfogadott környezeti változók,
• ismert limitációk.
