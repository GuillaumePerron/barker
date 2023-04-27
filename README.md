# Barker
[![](static/images/barker-logo.png)](https://barker-guillaumeperron.vercel.app/)
- **Nom de l’entreprise :** Banana Software
- **Nom de l’application :** Barker
- **Logo :** Chien jaune  
- **Livraison :** 3 mois
- **Budget :** 3 millions de francs
- **Rôles :**
  -	*1 Chef de projet :* Adrien Féré
  -	*2 Développeurs Front-End :* Irwan Soer, Kevin Petit
  -	*2 Développeurs Back-End :* Guillaume Perron, Florian Audouard
  -	*1 Web Designer :* David Domergue
- **Langage :**
  -	*Front-End :* Javascript
  -	*Back-End :* Python
- **Hébergement du site :** Vercel
- **Code couleur :** Jaune et noire
- **Gestion des tâches :** [Notion](https://www.notion.so/barker-app/442e4bcd0ca04b71a3a1025f0861f070?v=75ab636be9d444e7bc8e98b9fe2ff275)

# Lancer le projet en local :

- **Programmes nécessaires :**
  - *Python*
  - *Postgres*
- **Instalation des packages Python :**
  - `pip install -r requirements.txt`
- **Initialisation de la base de données :**
  - *Mettre le dossier PostgreSQL\15\bin dans le path pour utiliser la commande `psql`*
  - *Se connecter à la base de données en tant que `postgres` : `psql --username==postgres`*
  - `CREATE USER barker PASSWORD 'barker';`
  - `CREATE DATABASE barker WITH OWNER barker;`
  - *Créer un fichier `.env` qui contient*
    ```ini
    HOST=localhost
    PORT=5432
    DATABASE=barker
    USER=barker
    PASSWORD=barker
    ```
  - `python database.py`
- **Lancer le serveur :**
  - `python server.py`
  - *Aller à l'URL http://localhost*
  