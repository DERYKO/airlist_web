#Module: Auth
 - A user can login 
 - A user can register **
 - A user can recover password **
 - Throttles invalid tries after numerous tries **
 - Logout 
 
#Module: Dashboard
- Default dashboard loads 
- Custom dashboard loads 

#Module: Contacts
- No contacts present **
- Contacts listed 
- Create new contact with first_name, last_name, email only 
- Create new contact with all standard fields
- Create new contact with different custom fields 
- Update contact with different fields *
- Switch to grid view 
- Switch to table view 
- Grid view loads custom format **
- Clicking grid view to loads contact 
- Clicking on name in table view loads contact 
- Direct link to contact shows contact  
- Filtering by different contact fields works 
- Column selection possible  
- Can view deleted contacts 
- Can save presets
- Can load saved presets 
- Can import contacts 
- Can merge contacts 
- Can show mergeable
    - Show duplicates list
    - Can filter duplicates 
    - In duplicate details
        - can save  changes
        - can mark not duplicate
- Can delete selected  
- Can clear selection 
- Can update selected 
- Can Add to Guestlist 
- Can Add to Picklist 
- Can Add to Categories 
- Can Remove from Picklist(s) 
- Can Remove from Categories 
- Can Merge selected 
    - Reassigns rvsps, picklists, categories, messages for latest, oldest strategy
- Can Export contacts 
- Can Genderize unknown contacts 
- Can Genderize all contacts 


#Module: Guestlists

- Create guestlists  
- Select columns 
- Show deleted 
- Load presets 
- Save presets  
- Show masterlist
- Back on Masterlist goes to guestlist
- Goes directly to masterlist
- Sort columns  
- Filter columns  
- Click on guestlist name 
- Go directly to guestlist 
- Deleted selected 
- Clear selection  
- Clear filters  
- View bookings  
- Duplicate selected **
- List rsvps
- Quick add contact *
- Edit seatmap **
- Switch to Grid view
- Switch to Table view 
- Can go to Settings 
- Make a new booking *
- Select columns 
- Show deleted 
  - Show All 
- Load presets 
- Save presets 
- Import rsvps **
- Delete selected 
- Clear selection 
- Update contacts *
- Add to Address book 
- Genderize rsvps 
- Remove duplicates *
- Export rsvps 
- Update selected rsvps *
- Add to picklist *
- Add to Categories *
- Remove from categories 
- Copy to Guestlist *
- Move to Guestlist *
- Merge selected *
- Click on name shows rsvp 
- Checkin rsvp 
- Scroll up/down 
- Unselect rsvp 
- Edit Rsvp *
- Delete Rsvp *



#Module Picklists
 - List picklists 
 - Create picklist 
 - Sort picklists 
 - Filter picklists 
 - Select columns 
 - Show deleted 
 - Load presets 
 - Save presets 
 - Restore deleted 
 - Delete permanently 
 - Delete selected 
 - Update selected 
 
 
#Module Messages
- Sort messages 
- Filter messages  
    - Status 
    - Recipient 
- List messages 
    - subject 
    - recipient 
- Compose new 
- Click message recepient to email 
- Direct loading message  
- Gets mailgun reference_id
- Mailgun webhooks work

#Module Templates
- List templates 
- Filter templates *
- Sort templates 
    - stats *
- Delete selected 
- Create template *
- Fix Beefree 
- Edit template 
- Send test email *
    - Not logged **
- Preview email 
- Duplicate template 
- Restore selected 
- Delete permanently 
 
 
#Module Tickets
- Create ticket
    - refresh 
- List tickets 
    - text content
    - image *
- Filter tickets 
- Sort tickets 
    - name 
- Select columns 
- Load presets 
- Save presets 
- Show deleted 
- Deleted selected 
- Restore selected  
- Delete permanently *
- Download sample *
    - Rsvp: test user *
    
#Module Passbook
- Create passbook
- Click name to view
- Direct link works 
- Download passbook *
- Edit passbook
- Sort list
- Filter passbook 
- Select columns
    - image fields *
- Delete selected
- Load presets 
- Save presets
- Restore selected 
- Delete permanently *

#Module users
- Create user 
- List users 
- Edit user 
    - update profile image refresh *
- View user 
- Delete user
- Restore user 
- Delete selected 
- Restore selected
- Delete permanently *
    
#Module Categories

- List categories 
- Show deleted 
- Filter categories  
- Sort cagegories 
- Delete selected 
- Restore selected  
- Delete permanently * 


#Module Payments

- List payments 
- sort payments  
    - contact.full_name  
- Filter payments
- Create payment 
    - credit card ** 
    - invoice 
    - sepa 
- Download invoice *
- Cancel *
- Mark as paid 
- Details
- Download -> close **
- Download -> Cancellation **
- Download -> Invoice **
- Click name loads contact
- Contact back loads payments 
- attach credit card 
    - Correct details 
    - Invalid details 

#Module Profile

- Show profile 
- Show Token *
- Get New Token *
- Edit Profile
    - Photo 
    - Password **
- Edit Shortcuts 

#Module Settings
## Notifications
- Registered Email **
- Registered Sms **
- Checked in Email **
- Checked in Sms **
- Payment Status **
    - charge successful - user **
    - charge successful - contact **
    - charge failed - user **
    - charge failed - contact **
    
## Blacklist
- Emails  
- Mobile 

# Custom fields
 - boolean
 - textbox 
 - textarea 


#Fixes Required
- show deleted, hide global actions 
- disable edit/delete categories when showing deleted
- Remove activated a/c in profile 
- Stripe charge not logged 
- Refresh on create contact
- Hide seat from user profile
- Login request user again