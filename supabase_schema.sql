-- Create chat_sessions table
CREATE TABLE chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for chat_sessions
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for chat_sessions
CREATE POLICY "Users can only view their own chat sessions"
ON chat_sessions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat sessions"
ON chat_sessions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat sessions"
ON chat_sessions FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat sessions"
ON chat_sessions FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create chat_messages table
CREATE TABLE chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES chat_sessions ON DELETE CASCADE NOT NULL,
  role text CHECK (role IN ('user', 'assistant')) NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for chat_messages
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for chat_messages
CREATE POLICY "Users can view their own chat messages"
ON chat_messages FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM chat_sessions
    WHERE chat_sessions.id = chat_messages.session_id
    AND chat_sessions.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their own chat messages"
ON chat_messages FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM chat_sessions
    WHERE chat_sessions.id = chat_messages.session_id
    AND chat_sessions.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own chat messages"
ON chat_messages FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM chat_sessions
    WHERE chat_sessions.id = chat_messages.session_id
    AND chat_sessions.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own chat messages"
ON chat_messages FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM chat_sessions
    WHERE chat_sessions.id = chat_messages.session_id
    AND chat_sessions.user_id = auth.uid()
  )
);
