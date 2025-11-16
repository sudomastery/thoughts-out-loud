## Frontend Overview (React + Vite)

This folder contains the single-page application (SPA) for Thoughts Out Loud. It consumes the backend REST API and manages authenticated user flows (login, feed, profile, hashtags, post detail). Styling uses TailwindCSS (configured implicitly via Vite) and Flowbite React components (some replaced with custom lightweight markup).

### Directory Tree (Annotated)
```
frontend/
	index.html                # Root HTML loaded by Vite; mounts React app to <div id="root">.
	package.json              # Frontend dependencies and scripts (dev/build/lint/preview).
	vite.config.js            # Vite configuration (plugins like React, server options).
	eslint.config.js          # ESLint setup (rules for JS/JSX code quality).
	src/
		main.jsx                # Application entry; renders <App/> into DOM, sets up router provider.
		App.jsx                 # (If present) high-level app shell / future global layout wrapper.
		index.css               # Global CSS imports; Tailwind layers and overrides.
		App.css                 # Component-level styles (legacy from template; can be trimmed).
		assets/                 # Static assets (svgs, logos) imported by components.
			react.svg             # Example SVG asset (template leftover).
		pages/                  # Route-level components mapped in `router.jsx`.
			router.jsx            # Central react-router route declarations + ProtectedRoute wrapper.
			FeedPage.jsx          # Main feed: composer + list of `PostCard`s, local state for posts.
			LoginPage.jsx         # Login form: sets auth store token/user; redirects to /feed on success.
			SignupPage.jsx        # Sign-up form (placeholder/MVP); may navigate to /login after create.
			ProfilePage.jsx       # User profile page (placeholder); loads by /u/:username.
			HashtagPage.jsx       # Displays posts for a hashtag (placeholder) via /hashtag/:name.
			PostDetailPage.jsx    # Single post view with replies composer and back button.
		components/             # Reusable visual units grouped by domain.
			feed/
				PostCard.jsx        # Renders a single post: avatar, username link, body, actions, owner menu.
				PostActions.jsx     # Action bar (Comment, Like, Share) with counts.
				NewPostForm.jsx     # Composer for creating a new post (textarea + character counter + Post button).
			comments/
				CommentComposer.jsx # Reply composer used inside PostDetailPage.
		store/
			authStore.js          # Zustand auth state (token + user + helpers). Used for gating routes & owner checks.
		pages/... (others)      # Placeholder pages to expand functionality.
```

### File Purposes (Detailed)
- `router.jsx`: Declares public and protected routes. Wraps pages needing auth with `ProtectedRoute`. Unknown paths redirect to `/feed` if authed, else to `/login`.
- `FeedPage.jsx`: Holds an array of post objects in local state, supports create, like toggle, and delete. Renders `NewPostForm` and maps posts to `PostCard`.
- `PostCard.jsx`: Displays post content and metadata. Username is a clickable `<Link/>` to profile. The three-dot menu (⋮) appears only for the owner and allows deletion (local state removal). Has `PostActions` for interaction.
- `PostActions.jsx`: Stateless control bar receiving counts and callbacks: `onReply`, `onLikeToggle`, `onShare`.
- `NewPostForm.jsx`: Controlled textarea with 280 char limit and a Post button; calls parent `onSubmit(body)`.
- `PostDetailPage.jsx`: Fetches or receives a post ID from route params, renders the main `PostCard`, a reply `CommentComposer`, and a list of mock comments. Includes a Back button to `/feed`.
- `CommentComposer.jsx`: Simple textarea + Post reply button (character limit) used for replies.
- `authStore.js`: Zustand store exposing `login`, `logout`, `setUser`, and derived `isAuthed` via selector. Token presence drives auth gating.
- `HashtagPage.jsx`: Placeholder to show posts that contain a given hashtag (to be wired to backend `/hashtags/:name`).
- `ProfilePage.jsx`: Placeholder for user profile (to be wired to backend `/users/:username`).
- `LoginPage.jsx` / `SignupPage.jsx`: Authentication entry points; will integrate with backend `/auth/login` and `/auth/signup`.

### User Flow & Action Routing
Below are common user actions and where the application routes / which components load:

1. Unauthenticated visit:
	 - Navigate to `/feed` or any protected route → `ProtectedRoute` checks `authStore.token`; if absent, redirect to `/login`.
	 - `/login` renders `LoginPage`. Successful login (`authStore.login`) sets token/user then `Navigate` pushes `/feed`.

2. Viewing Feed:
	 - Path: `/feed` → `FeedPage`.
	 - Creating a post: Typing in `NewPostForm` and pressing Post triggers `handleCreate`, prepends a new post object; re-renders list.
	 - Liking a post: Clicking Like in `PostActions` calls `onLikeToggle` → `FeedPage.handleLike` updates counts & liked flag.
	 - Deleting own post: Owner clicks ⋮ → menu opens → Delete button → `FeedPage.handleDelete` filters post from state.
	 - Commenting on a post: Click Comment → `navigate(/u/:username/status/:id)` via `PostActions.onReply` → loads `PostDetailPage`.
	 - Sharing: Click Share → attempts `navigator.share` or copies URL to clipboard fallback.

3. Username Click:
	 - In `PostCard`, clicking the username `<Link>` routes to `/u/:username` → loads `ProfilePage` (placeholder until backend integration).

4. Hashtag Click:
	 - In post body, hashtags are parsed into `<Link>`s to `/hashtag/:name` → loads `HashtagPage` for that tag.

5. Post Detail:
	 - Path: `/u/:username/status/:id` → `PostDetailPage` shows the post + replies composer.
	 - Replying: Submit in `CommentComposer` updates local replies list (mock) and increments reply count in displayed post object.
	 - Back button: Navigates to `/feed` using `useNavigate`.

6. Logout (future):
	 - Trigger from a future NavBar/Account menu → `authStore.logout()` → token cleared → navigating protected routes redirects back to `/login`.

### Component Interaction Summary
- `FeedPage` <-> `PostCard`: passes callbacks `onLike`, `onDelete` enabling local mutations.
- `PostCard` -> `PostActions`: passes state flags/counts + handlers to trigger navigation (`onReply`), likes, share logic.
- `PostDetailPage` -> `CommentComposer`: collects reply text and injects into local replies list.
- `ProtectedRoute` uses `authStore` to guard access; all route-level components rely on the store for conditional rendering.

### Future Integration Points
- Replace mock posts with API calls (`GET /posts/feed`).
- Use route params in `PostDetailPage` to fetch a single post and its replies (`GET /posts/:id`).
- Implement profile fetch in `ProfilePage` (`GET /users/:username`).
- Implement hashtag post listing in `HashtagPage` (`GET /hashtags/:name`).
- Add global navigation (NavBar) and logout control.
- Consider TanStack Query for server state consistency and caching beyond MVP.

### Development Scripts
From `frontend/`:
```
npm install    # install dependencies
npm run dev    # start Vite dev server
npm run build  # production build
npm run preview# preview build locally
```

### Notes
This README focuses on the application-specific structure rather than the generic Vite template. As features expand (API integration, query caching), update sections above accordingly.

