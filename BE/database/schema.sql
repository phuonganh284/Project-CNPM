-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.book_copies (
  copy_id integer NOT NULL DEFAULT nextval('book_copies_copy_id_seq'::regclass),
  book_id integer NOT NULL,
  condition integer CHECK (condition >= 0 AND condition <= 100),
  status character varying DEFAULT 'normal'::character varying,
  copy_price numeric CHECK (copy_price >= 0::numeric),
  availability boolean DEFAULT true,
  borrowed boolean NOT NULL DEFAULT false CHECK (borrowed = ANY (ARRAY[true, false])),
  CONSTRAINT book_copies_pkey PRIMARY KEY (copy_id),
  CONSTRAINT book_copies_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.book_titles(book_id)
);
CREATE TABLE public.book_titles (
  book_id integer NOT NULL DEFAULT nextval('book_titles_book_id_seq'::regclass),
  isbn text NOT NULL UNIQUE,
  cover text,
  title text NOT NULL,
  author text DEFAULT 'To be updated.'::text,
  language text DEFAULT '''To be updated.''::text'::text,
  publisher text DEFAULT '''To be updated.''::text'::text,
  publish_year integer CHECK (publish_year >= 0),
  description text,
  price numeric NOT NULL CHECK (price >= 0::numeric),
  total_stock integer DEFAULT 0 CHECK (total_stock >= 0),
  availability_status character varying DEFAULT 'available'::character varying CHECK (availability_status::text = ANY (ARRAY['out-of-stock'::character varying, 'available'::character varying, 'borrowed'::character varying]::text[])),
  available_stock integer NOT NULL DEFAULT 0 CHECK (available_stock >= 0),
  category_id integer,
  borrow_count integer DEFAULT 0 CHECK (borrow_count >= 0),
  is_deleted boolean NOT NULL DEFAULT false CHECK (is_deleted = ANY (ARRAY[true, false])),
  CONSTRAINT book_titles_pkey PRIMARY KEY (book_id),
  CONSTRAINT book_titles_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(category_id)
);
CREATE TABLE public.borrow_history (
  history_id integer NOT NULL DEFAULT nextval('borrow_history_history_id_seq'::regclass),
  reader_id integer,
  borrow_id integer,
  status character varying CHECK (status::text = ANY (ARRAY['on-time'::character varying, 'overdue'::character varying]::text[])),
  late_fee numeric DEFAULT 0,
  damage_fee numeric DEFAULT 0,
  total_fee numeric DEFAULT 0,
  librarian_assessed_condition character varying,
  reader_returned_condition integer,
  assessment_notes text,
  return_id integer,
  copy_id integer,
  borrow_date timestamp without time zone,
  due_date timestamp without time zone,
  return_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  borrowed_copy_price numeric,
  CONSTRAINT borrow_history_pkey PRIMARY KEY (history_id),
  CONSTRAINT borrow_history_reader_id_fkey FOREIGN KEY (reader_id) REFERENCES public.readers(reader_id)
);
CREATE TABLE public.borrow_requests (
  request_id integer NOT NULL DEFAULT nextval('borrow_requests_request_id_seq'::regclass),
  reader_id integer,
  copy_id integer,
  request_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  pickup_date timestamp without time zone,
  status character varying DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying, 'approved'::character varying]::text[])),
  CONSTRAINT borrow_requests_pkey PRIMARY KEY (request_id),
  CONSTRAINT borrow_requests_reader_id_fkey FOREIGN KEY (reader_id) REFERENCES public.readers(reader_id),
  CONSTRAINT borrow_requests_copy_id_fkey FOREIGN KEY (copy_id) REFERENCES public.book_copies(copy_id)
);
CREATE TABLE public.borrowing_records (
  borrow_id integer NOT NULL DEFAULT nextval('borrowing_records_borrow_id_seq'::regclass),
  reader_id integer,
  copy_id integer,
  request_id integer,
  borrow_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  due_date timestamp without time zone,
  borrowed_copy_price numeric,
  status character varying DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying, 'approved'::character varying, 'returned'::character varying, 'overdue'::character varying, 'lost'::character varying]::text[])),
  renew_count integer DEFAULT 0 CHECK (renew_count >= 0),
  borrowed_condition integer CHECK (borrowed_condition >= 0 AND borrowed_condition <= 100),
  CONSTRAINT borrowing_records_pkey PRIMARY KEY (borrow_id),
  CONSTRAINT borrowing_records_reader_id_fkey FOREIGN KEY (reader_id) REFERENCES public.readers(reader_id),
  CONSTRAINT borrowing_records_copy_id_fkey FOREIGN KEY (copy_id) REFERENCES public.book_copies(copy_id),
  CONSTRAINT borrowing_records_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.borrow_requests(request_id)
);
CREATE TABLE public.categories (
  category_id integer NOT NULL DEFAULT nextval('categories_category_id_seq'::regclass),
  category_name character varying NOT NULL UNIQUE,
  amount integer DEFAULT 0 CHECK (amount >= 0),
  CONSTRAINT categories_pkey PRIMARY KEY (category_id)
);
CREATE TABLE public.librarians (
  librarian_id integer NOT NULL DEFAULT nextval('librarians_librarian_id_seq'::regclass),
  user_id integer NOT NULL UNIQUE,
  CONSTRAINT librarians_pkey PRIMARY KEY (librarian_id),
  CONSTRAINT librarians_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id)
);
CREATE TABLE public.notification_types (
  type_id integer NOT NULL DEFAULT nextval('notification_types_type_id_seq'::regclass),
  recipient_role character varying NOT NULL CHECK (recipient_role::text = ANY (ARRAY['reader'::character varying, 'librarian'::character varying]::text[])),
  type_name character varying NOT NULL UNIQUE,
  CONSTRAINT notification_types_pkey PRIMARY KEY (type_id)
);
CREATE TABLE public.notifications (
  notification_id integer NOT NULL DEFAULT nextval('notifications_notification_id_seq'::regclass),
  user_id integer NOT NULL,
  type_id integer NOT NULL,
  content text NOT NULL,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  is_read boolean DEFAULT false,
  borrow_request_id integer,
  borrow_id integer,
  return_request_id integer,
  receipt_id integer,
  is_viewed boolean DEFAULT false,
  metadata jsonb,
  CONSTRAINT notifications_pkey PRIMARY KEY (notification_id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id),
  CONSTRAINT notifications_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.notification_types(type_id),
  CONSTRAINT notifications_borrow_request_id_fkey FOREIGN KEY (borrow_request_id) REFERENCES public.borrow_requests(request_id),
  CONSTRAINT notifications_borrow_id_fkey FOREIGN KEY (borrow_id) REFERENCES public.borrowing_records(borrow_id),
  CONSTRAINT notifications_return_request_id_fkey FOREIGN KEY (return_request_id) REFERENCES public.return_requests(return_id),
  CONSTRAINT notifications_receipt_id_fkey FOREIGN KEY (receipt_id) REFERENCES public.receipts(receipt_id)
);
CREATE TABLE public.readers (
  reader_id integer NOT NULL DEFAULT nextval('readers_reader_id_seq'::regclass),
  user_id integer NOT NULL UNIQUE,
  CONSTRAINT readers_pkey PRIMARY KEY (reader_id),
  CONSTRAINT readers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id)
);
CREATE TABLE public.receipts (
  receipt_id integer NOT NULL DEFAULT nextval('receipts_receipt_id_seq'::regclass),
  reader_id integer,
  return_id integer UNIQUE,
  overdue_rate numeric,
  overdue_days integer,
  damage_rate numeric,
  total_fee numeric,
  CONSTRAINT receipts_pkey PRIMARY KEY (receipt_id),
  CONSTRAINT receipts_reader_id_fkey FOREIGN KEY (reader_id) REFERENCES public.readers(reader_id),
  CONSTRAINT receipts_return_id_fkey FOREIGN KEY (return_id) REFERENCES public.return_requests(return_id)
);
CREATE TABLE public.return_requests (
  return_id integer NOT NULL DEFAULT nextval('return_requests_return_id_seq'::regclass),
  reader_id integer,
  borrow_id integer,
  request_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  status character varying DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying, 'assessed'::character varying, 'completed'::character varying]::text[])),
  returned_condition integer CHECK (returned_condition >= 0 AND returned_condition <= 100),
  assessed_condition character varying CHECK (assessed_condition::text = ANY (ARRAY['OK'::character varying, 'MINOR'::character varying, 'MODERATE'::character varying, 'SEVERE'::character varying, 'LOST'::character varying]::text[])),
  damage_percentage numeric CHECK (damage_percentage >= 0::numeric AND damage_percentage <= 100::numeric),
  overdue_fee numeric DEFAULT 0 CHECK (overdue_fee >= 0::numeric),
  damage_fee numeric DEFAULT 0 CHECK (damage_fee >= 0::numeric),
  total_fee numeric DEFAULT 0 CHECK (total_fee >= 0::numeric),
  damage_details jsonb,
  assessment_notes text,
  assessed_at timestamp without time zone,
  completed_at timestamp without time zone,
  CONSTRAINT return_requests_pkey PRIMARY KEY (return_id),
  CONSTRAINT return_requests_reader_id_fkey FOREIGN KEY (reader_id) REFERENCES public.readers(reader_id),
  CONSTRAINT return_requests_borrow_id_fkey FOREIGN KEY (borrow_id) REFERENCES public.borrowing_records(borrow_id)
);
CREATE TABLE public.users (
  user_id integer NOT NULL DEFAULT nextval('users_user_id_seq'::regclass),
  username character varying NOT NULL UNIQUE,
  email character varying NOT NULL UNIQUE,
  password character varying NOT NULL,
  name character varying NOT NULL,
  status character varying DEFAULT 'active'::character varying CHECK (status::text = ANY (ARRAY['active'::character varying, 'banned'::character varying, 'borrowing'::character varying, 'overdue'::character varying]::text[])),
  profile_picture text,
  is_verified boolean DEFAULT false,
  verification_token character varying,
  verification_expires timestamp without time zone,
  reset_token character varying,
  reset_token_expires timestamp without time zone,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  borrowcount integer DEFAULT 0 CHECK (borrowcount >= 0),
  CONSTRAINT users_pkey PRIMARY KEY (user_id)
);