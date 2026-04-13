const TermAndPrivacy = () => {
  return (
    <>
      <div
        className="modal fade"
        id="termsModal"
        tabIndex={-1}
        aria-labelledby="termsModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="termsModalLabel">
                Terms and Conditions
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                in dui mauris. Vivamus hendrerit arcu sed erat molestie
                vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh
                porttitor. Ut in nulla enim. Phasellus molestie magna non est
                bibendum non venenatis nisl tempor.
              </p>
              <p>
                Suspendisse in orci enim. Vivamus hendrerit arcu sed erat
                molestie vehicula. Sed auctor neque eu tellus rhoncus ut
                eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie
                magna non est bibendum non venenatis nisl tempor.
              </p>
              <p>
                Suspendisse in orci enim. Vivamus hendrerit arcu sed erat
                molestie vehicula. Sed auctor neque eu tellus rhoncus ut
                eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie
                magna non est bibendum non venenatis nisl tempor.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="privacyModal"
        tabIndex={-1}
        aria-labelledby="privacyModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="privacyModalLabel">
                Privacy Policy
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                in dui mauris. Vivamus hendrerit arcu sed erat molestie
                vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh
                porttitor. Ut in nulla enim.
              </p>
              <p>
                Suspendisse in orci enim. Vivamus hendrerit arcu sed erat
                molestie vehicula. Sed auctor neque eu tellus rhoncus ut
                eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie
                magna non est bibendum non venenatis nisl tempor.
              </p>
              <p>
                Suspendisse in orci enim. Vivamus hendrerit arcu sed erat
                molestie vehicula. Sed auctor neque eu tellus rhoncus ut
                eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie
                magna non est bibendum non venenatis nisl tempor.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermAndPrivacy;
