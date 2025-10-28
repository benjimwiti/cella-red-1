drop extension if exists "pg_net";

drop trigger if exists "on_circle_created" on "public"."circles";

drop policy "Users can insert their own mood logs" on "public"."mood_logs";

drop policy "Users can update their own mood logs" on "public"."mood_logs";

drop policy "Users can view their own mood logs" on "public"."mood_logs";

drop policy "Circle creators can create invites" on "public"."circle_invites";

drop policy "Users can view invites for their circles" on "public"."circle_invites";

drop policy "Circle creators can manage memberships" on "public"."circle_members";

drop policy "Users can view circle members for their circles" on "public"."circle_members";

drop policy "Users can view circles they are members of" on "public"."circles";

revoke delete on table "public"."medication_preferences" from "anon";

revoke insert on table "public"."medication_preferences" from "anon";

revoke references on table "public"."medication_preferences" from "anon";

revoke select on table "public"."medication_preferences" from "anon";

revoke trigger on table "public"."medication_preferences" from "anon";

revoke truncate on table "public"."medication_preferences" from "anon";

revoke update on table "public"."medication_preferences" from "anon";

revoke delete on table "public"."medication_preferences" from "authenticated";

revoke insert on table "public"."medication_preferences" from "authenticated";

revoke references on table "public"."medication_preferences" from "authenticated";

revoke select on table "public"."medication_preferences" from "authenticated";

revoke trigger on table "public"."medication_preferences" from "authenticated";

revoke truncate on table "public"."medication_preferences" from "authenticated";

revoke update on table "public"."medication_preferences" from "authenticated";

revoke delete on table "public"."medication_preferences" from "service_role";

revoke insert on table "public"."medication_preferences" from "service_role";

revoke references on table "public"."medication_preferences" from "service_role";

revoke select on table "public"."medication_preferences" from "service_role";

revoke trigger on table "public"."medication_preferences" from "service_role";

revoke truncate on table "public"."medication_preferences" from "service_role";

revoke update on table "public"."medication_preferences" from "service_role";

revoke delete on table "public"."mood_logs" from "anon";

revoke insert on table "public"."mood_logs" from "anon";

revoke references on table "public"."mood_logs" from "anon";

revoke select on table "public"."mood_logs" from "anon";

revoke trigger on table "public"."mood_logs" from "anon";

revoke truncate on table "public"."mood_logs" from "anon";

revoke update on table "public"."mood_logs" from "anon";

revoke delete on table "public"."mood_logs" from "authenticated";

revoke insert on table "public"."mood_logs" from "authenticated";

revoke references on table "public"."mood_logs" from "authenticated";

revoke select on table "public"."mood_logs" from "authenticated";

revoke trigger on table "public"."mood_logs" from "authenticated";

revoke truncate on table "public"."mood_logs" from "authenticated";

revoke update on table "public"."mood_logs" from "authenticated";

revoke delete on table "public"."mood_logs" from "service_role";

revoke insert on table "public"."mood_logs" from "service_role";

revoke references on table "public"."mood_logs" from "service_role";

revoke select on table "public"."mood_logs" from "service_role";

revoke trigger on table "public"."mood_logs" from "service_role";

revoke truncate on table "public"."mood_logs" from "service_role";

revoke update on table "public"."mood_logs" from "service_role";

alter table "public"."medication_preferences" drop constraint "medication_preferences_user_id_fkey";

alter table "public"."mood_logs" drop constraint "mood_logs_mood_level_check";

alter table "public"."mood_logs" drop constraint "mood_logs_user_id_date_key";

alter table "public"."mood_logs" drop constraint "mood_logs_user_id_fkey";

alter table "public"."circle_invites" drop constraint "circle_invites_circle_id_fkey";

alter table "public"."circle_members" drop constraint "circle_members_circle_id_fkey";

alter table "public"."medication_logs" drop constraint "medication_logs_medication_id_fkey";

alter table "public"."medication_preferences" drop constraint "medication_preferences_pkey";

alter table "public"."mood_logs" drop constraint "mood_logs_pkey";

drop index if exists "public"."idx_mood_logs_user_date";

drop index if exists "public"."medication_preferences_pkey";

drop index if exists "public"."mood_logs_pkey";

drop index if exists "public"."mood_logs_user_id_date_key";

drop table "public"."medication_preferences";

drop table "public"."mood_logs";

alter table "public"."circles" alter column "invite_code" set default encode(extensions.gen_random_bytes(6), 'base64'::text);

alter table "public"."medications" drop column "is_taken";

alter table "public"."medications" drop column "last_taken_at";

alter table "public"."medications" add column "frequency" text not null;

alter table "public"."medications" alter column "time_of_day" set default '{}'::text[];

alter table "public"."medications" alter column "time_of_day" set not null;

alter table "public"."medications" alter column "time_of_day" set data type text[] using "time_of_day"::text[];

alter table "public"."circle_invites" add constraint "circle_invites_circle_id_fkey" FOREIGN KEY (circle_id) REFERENCES public.circles(id) ON DELETE CASCADE not valid;

alter table "public"."circle_invites" validate constraint "circle_invites_circle_id_fkey";

alter table "public"."circle_members" add constraint "circle_members_circle_id_fkey" FOREIGN KEY (circle_id) REFERENCES public.circles(id) ON DELETE CASCADE not valid;

alter table "public"."circle_members" validate constraint "circle_members_circle_id_fkey";

alter table "public"."medication_logs" add constraint "medication_logs_medication_id_fkey" FOREIGN KEY (medication_id) REFERENCES public.medications(id) ON DELETE CASCADE not valid;

alter table "public"."medication_logs" validate constraint "medication_logs_medication_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_circle_creator()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.circle_members (circle_id, user_id, role, status)
  VALUES (NEW.id, NEW.creator_id, 'creator', 'approved');
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', new.email)
  );
  RETURN new;
END;
$function$
;


  create policy "Circle creators can create invites"
  on "public"."circle_invites"
  as permissive
  for insert
  to public
with check ((EXISTS ( SELECT 1
   FROM public.circles
  WHERE ((circles.id = circle_invites.circle_id) AND (circles.creator_id = auth.uid())))));



  create policy "Users can view invites for their circles"
  on "public"."circle_invites"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.circles
  WHERE ((circles.id = circle_invites.circle_id) AND (circles.creator_id = auth.uid())))));



  create policy "Circle creators can manage memberships"
  on "public"."circle_members"
  as permissive
  for update
  to public
using ((EXISTS ( SELECT 1
   FROM public.circles
  WHERE ((circles.id = circle_members.circle_id) AND (circles.creator_id = auth.uid())))));



  create policy "Users can view circle members for their circles"
  on "public"."circle_members"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.circle_members cm
  WHERE ((cm.circle_id = circle_members.circle_id) AND (cm.user_id = auth.uid()) AND (cm.status = 'approved'::text)))));



  create policy "Users can view circles they are members of"
  on "public"."circles"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.circle_members
  WHERE ((circle_members.circle_id = circles.id) AND (circle_members.user_id = auth.uid()) AND (circle_members.status = 'approved'::text)))));


CREATE TRIGGER on_circle_created AFTER INSERT ON public.circles FOR EACH ROW EXECUTE FUNCTION public.add_circle_creator();

drop trigger if exists "on_auth_user_created" on "auth"."users";

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


