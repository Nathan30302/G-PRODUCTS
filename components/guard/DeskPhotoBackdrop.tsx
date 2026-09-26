/** One catalogue photo for the day. It stays put until the next day. */
export function DeskPhotoBackdrop({ photo }: { photo: string }) {
  return (
    <div className="desk-stage-photos" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element -- real catalogue photo */}
      <img src={photo} alt="" />
      <span className="desk-stage-shade" />
    </div>
  );
}
