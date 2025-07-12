# Database-Driven Creator Pages

## Overview
The GetMeAChai platform now uses a database-driven approach for storing and managing creator profile pages. This provides dynamic behavior and allows for easy management of creator profiles.

## Database Schema

### Page Collection
The `pages` collection stores all creator profile information with the following fields:

#### Basic Information
- `username` (String, required, unique) - Creator's username
- `title` (String, required) - Creator's title/profession
- `description` (String, required) - Short description of what they do
- `category` (String, enum) - Category: art, tech, writing, music, education, gaming, lifestyle, business, health, other

#### Images
- `coverImage` (String) - URL for the cover photo
- `profileImage` (String) - URL for the profile picture

#### Content
- `about` (String, required) - Long form description/bio
- `skills` (Array of Strings) - List of skills/expertise
- `location` (Object) - City and country information
- `recentUpdates` (Array) - Recent activity/updates with title, description, date, and color
- `links` (Array) - Social media and portfolio links
- `goal` (Object) - Current fundraising goal with title, description, target amount, and current amount

#### Settings
- `isActive` (Boolean) - Whether the page is active
- `seo` (Object) - SEO metadata (optional)
- `createdAt` (Date) - Page creation date
- `updatedAt` (Date) - Last update date

## API Endpoints

### GET /api/page?username={username}
Retrieves page data for a specific creator.

**Response:**
```json
{
  "success": true,
  "page": {
    "username": "priyasharma",
    "title": "Digital Artist & UI Designer",
    "description": "Creating stunning digital illustrations and modern UI designs",
    // ... other fields
  }
}
```

### PUT /api/page?username={username}
Updates page data for a creator (creates if doesn't exist).

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  // ... other fields to update
}
```

## File Structure

```
models/
  Page.js          # Mongoose schema for page data
  
app/
  api/
    page/
      route.js     # API endpoints for page CRUD operations
  [username]/
    page.js        # Dynamic profile page (now database-driven)
  admin/
    page.js        # Admin interface for editing pages
    
scripts/
  seedPages.js     # Database seeding script
  
lib/
  connectdb.js     # Database connection utility
```

## How It Works

1. **Database Storage**: All creator profile data is stored in MongoDB using the `Page` model
2. **Dynamic Loading**: The `[username]/page.js` component fetches data from the database via the API
3. **Fallback Content**: If no database entry exists, fallback content is displayed
4. **Admin Interface**: Creators can edit their profiles through the `/admin` page
5. **Real-time Updates**: Changes are immediately reflected on the profile pages

## Usage

### Seeding the Database
Run the seeding script to populate the database with initial creator data:
```bash
npm run seed-pages
```

### Adding New Creators
1. Use the admin interface at `/admin` (requires authentication)
2. Or add data directly via the API endpoints
3. Or run the seeding script with updated data

### Updating Existing Profiles
1. Visit `/admin` while logged in to edit your profile
2. Changes are saved to the database and immediately visible

## Benefits

1. **Dynamic Content**: No need to hardcode creator information
2. **Scalability**: Easy to add new creators without code changes
3. **Management**: Creators can update their own profiles
4. **Consistency**: All profiles follow the same structure
5. **SEO**: Database-driven content is better for search engines
6. **Analytics**: Can track profile views and engagement

## Migration Notes

- Existing hardcoded creator data has been migrated to the database
- The profile page component now fetches data dynamically
- Fallback content ensures the page works even if database is unavailable
- All existing functionality (payments, authentication) remains unchanged

## Future Enhancements

- Image upload functionality
- Profile analytics dashboard
- Advanced SEO features
- Content moderation tools
- Bulk import/export capabilities
