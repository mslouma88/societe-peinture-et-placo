# Configuration EmailJS - Guide d'installation

## Étapes pour configurer EmailJS

### 1. Créer un compte EmailJS
- Allez sur [https://www.emailjs.com/](https://www.emailjs.com/)
- Créez un compte gratuit (200 emails/mois inclus)

### 2. Configurer un service email
- Dans le dashboard EmailJS, allez dans "Email Services"
- Cliquez sur "Add New Service"
- Choisissez votre fournisseur email (Gmail recommandé)
- Suivez les instructions pour connecter votre compte Gmail
- Notez le **Service ID** généré

### 3. Créer un template d'email
- Allez dans "Email Templates"
- Cliquez sur "Create New Template"
- Utilisez ce template :

```
Sujet: Nouvelle demande de devis - {{project_type}}

Bonjour Saber,

Vous avez reçu une nouvelle demande de devis via votre site web.

INFORMATIONS CLIENT :
- Nom : {{from_name}}
- Email : {{from_email}}
- Téléphone : {{phone}}

DÉTAILS DU PROJET :
- Type de projet : {{project_type}}
- Budget approximatif : {{budget}}
- Délai souhaité : {{timeline}}

MESSAGE :
{{message}}

OPTIONS :
- Demande de devis : {{quote_request}}
- Newsletter : {{newsletter}}

---
Message envoyé depuis le site Pro Peinture Placo
```

- Sauvegardez et notez le **Template ID**

### 4. Obtenir la clé publique
- Allez dans "Account" > "General"
- Copiez votre **Public Key**

### 5. Mettre à jour le code
Dans le fichier `script.js`, remplacez :
- `YOUR_SERVICE_ID` par votre Service ID
- `YOUR_TEMPLATE_ID` par votre Template ID  
- `YOUR_PUBLIC_KEY` par votre Public Key

### 6. Test
- Testez le formulaire sur votre site
- Vérifiez que l'email arrive bien dans la boîte de réception

## Avantages d'EmailJS
- ✅ Envoi direct depuis le site web
- ✅ Pas besoin de serveur backend
- ✅ 200 emails gratuits par mois
- ✅ Interface simple à configurer
- ✅ Fallback automatique vers mailto en cas d'erreur

## Support
En cas de problème, consultez la documentation EmailJS : https://www.emailjs.com/docs/