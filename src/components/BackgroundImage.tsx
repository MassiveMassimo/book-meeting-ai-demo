export function BackgroundImage() {
  return (
    <>
      <img
        src="/bg/hills-light.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-bottom dark:hidden"
        fetchPriority="high"
      />
      <img
        src="/bg/hills-dark.png"
        alt=""
        className="absolute inset-0 hidden h-full w-full object-cover object-bottom dark:block"
        fetchPriority="high"
      />
    </>
  );
}
