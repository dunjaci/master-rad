# Rezime

Ovaj rad predstavlja elektronsku lekciju posvećenu pronalasku početnog regiona replikacije DNK, odnosno oriC regiona. Aplikacija prikazuje kako se primenom algoritama nad DNK sekvencama mogu uočiti obrasci koji ukazuju na moguće mesto početka replikacije.

Lekcija obuhvata teorijsko objašnjenje i interaktivnu vizualizaciju problema čestih reči, pronalaženja grupa k-mera, GC-skew dijagrama, Hamingove distance i približnih poklapanja. Korisnik može da unese DNK sekvencu, podesi parametre algoritama i prati izvršavanje postupka korak po korak, čime se olakšava razumevanje načina na koji se izdvajaju kandidati za oriC region.

# Sadržaj

* Folder **frontend** sadrži sav kod vezan za klijentsku aplikaciju.
* Folder **backend** sadrži sav kod vezan za serversku aplikaciju.
* Fajl **start-project.bat** omogućava lokalno pokretanje oba dela aplikacije.

# Korišćenje aplikacije

Pokretanje aplikacije može se izvršiti na dva načina:

* direktnim pokretanjem Frontend i Backend komponente,
* korišćenjem deployovane verzije aplikacije.

## Direktno pokretanje komponenti

Da bi se aplikacija pokrenula lokalno, potrebno je posebno pokrenuti Frontend i Backend deo. Frontend deo aplikacije dostupan je na adresi **http://localhost:3000**, dok se backend deo aplikacije pokreće na adresi **http://localhost:8000**.

### Frontend aplikacija

Za direktno pokretanje Frontend aplikacije potrebno je imati instaliran **Node.js** i **npm** paket menadžer. Potrebno je pozicionirati se u **/frontend** direktorijum i pokrenuti sledeće komande:

```bash
npm install
npm run build
npm run start
```

Nakon pokretanja ovih komandi klijentskom delu aplikacije može se pristupiti iz veb pregledača na adresi **http://localhost:3000**.

U toku razvoja aplikacija se može pokrenuti naredbom:

```bash
npm run dev
```

### Backend aplikacija

Za direktno pokretanje Backend aplikacije potrebno je imati instaliran **Python 3.12** i **pip** paket menadžer. Potrebno je pozicionirati se u **/backend** direktorijum i izvršiti sledeće komande:

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Ovim komandama se kreira virtuelno okruženje, instaliraju se potrebne zavisnosti i pokreće se serverski deo aplikacije. Nakon pokretanja, backend servis je dostupan na adresi **http://localhost:8000**, dok se automatska dokumentacija API-ja nalazi na adresi **http://localhost:8000/docs**.

## Podešavanje komunikacije

Frontend aplikacija koristi promenljivu okruženja **NEXT_PUBLIC_API_BASE_URL** kako bi znala na kojoj adresi se nalazi backend servis. Primer konfiguracije nalazi se u fajlu **frontend/.env.example**:

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Za lokalno pokretanje koristi se vrednost **http://localhost:8000**.

## Deployovana verzija

Deploy aplikacije je podeljen na dve komponente. Frontend deo aplikacije deployovan je na **Vercel** platformi i služi za prikaz elektronske lekcije, formi za unos podataka i interaktivnih vizualizacija. Backend deo aplikacije deployovan je na **Render** platformi i zadužen je za obradu zahteva i izvršavanje bioinformatičkih algoritama.

Deployovana aplikacija dostupna je na sledećem linku:

https://master-rad-seven.vercel.app/

Kada se pristupi linku može biti potrebno nekoliko sekundi da se serverski deo aplikacije pokrene.

# Tehnologije

U projektu su korišćene sledeće tehnologije:

* **Next.js** i **React** za klijentski deo aplikacije,
* **Tailwind CSS** za stilizaciju korisničkog interfejsa,
* **FastAPI** za serverski deo aplikacije,
* **Python** za implementaciju algoritama,
* **Uvicorn** za pokretanje backend servera.
