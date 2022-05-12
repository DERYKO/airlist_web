function AirlstSeatPlanDrawing(canvas, drawInfo, events, debug) {
  var _debug = debug || false,
    pub = this,
    priv = {
      canvas: canvas,
      drawInfo: drawInfo,
      context: null,
      drawObjects: [],
      mouse: {
        x: 0,
        y: 0
      },
      events: events || [],
      lastHovered: null,
      curRotation: 0,
      selectedStatus: '',
      selectedIds: []
    };

  pub._canvas = canvas;
  pub._drawInfo = drawInfo;

  var _debugLog = function (dataToLog) {
      if (_debug) {
        console.log.apply(this, arguments);
      }
    },
    _init = function () {
      _debugLog('started canvas creation', priv.canvas, priv.drawInfo);
      _initCanvasProperties();
      _redrawWholeGraphic();
      _initEvents();
    },
    _initCanvasProperties = function () {
      _debugLog('creating canvas context and setting base properties');
      priv.context = priv.canvas.getContext('2d');
      _debugLog(priv.context);
    },
    _redrawWholeGraphic = function () {
      _setCursor('default');
      priv.context.beginPath();
      priv.context.fillStyle = priv.drawInfo.background;
      priv.context.fillRect(0, 0, priv.canvas.width, priv.canvas.height);
      priv.context.closePath();

      priv.drawObjects = _redrawObjectsList(priv.drawInfo.objects);
    },
    _redrawObjectsList = function (drawObjectsList) {
      var returnObjects = [],
        currentHoverElement = _getHoveredDrawElement();

      for (var i = 0; i < drawObjectsList.length; i++) {
        var currentDrawObject = drawObjectsList[i],
          hoverState = (currentHoverElement && currentDrawObject.id == currentHoverElement.id),
          fillStyle = _getFillStyleForDrawObject(currentDrawObject, hoverState),
          sizes;

        if (hoverState && currentHoverElement.clickable) {
          _setCursor('pointer');
        }
        priv.context.beginPath();
        priv.context.fillStyle = fillStyle;
        switch (currentDrawObject.type) {
          case 'rectangle':
          default:
            sizes = _generateRectangleSizes(currentDrawObject);
            priv.context.fillRect(sizes.pos_x, sizes.pos_y, sizes.size_x, sizes.size_y);
            returnObjects.push({
              type: 'rectangle',
              sizes: sizes
            });

            _drawTextForDrawObject(currentDrawObject, sizes);
            break;
        }

        priv.context.closePath();

        if (currentDrawObject.border && currentDrawObject.border.color && currentDrawObject.border.width) {
          _drawObjectBorders(currentDrawObject, sizes);
        }

        if (currentDrawObject.objects && currentDrawObject.objects.length > 0) {
          _redrawObjectsList(currentDrawObject.objects);
        }
      }

      return returnObjects;
    },
    _drawTextForDrawObject = function (drawObject, drawObjectSizes) {
      if (typeof drawObject.labels != 'undefined') {
        priv.context.translate(drawObjectSizes.pos_x, drawObjectSizes.pos_y);
        for (var labelOrientation in drawObject.labels) {
          var curLabelSet = drawObject.labels[labelOrientation];
          for (var labelPosition in curLabelSet) {
            var curLabelObject = curLabelSet[labelPosition],
              maxFontWidth = (labelOrientation == 'vertical') ? _calculateY(drawObject.size.y) : _calculateX(drawObject.size.x),
              styleInformation = _calculateAndSetFontStyle(curLabelObject, drawObject, maxFontWidth),
              position = {
                x: 0,
                y: 0
              };

            if (!curLabelObject.text) {
              continue;
            }

            switch (labelPosition) {
              case 'top':
                position.x = (drawObjectSizes.size_x / 2) - styleInformation.width / 2;
                position.y = styleInformation.size;
                break;

              case 'bottom':
                position.x = (drawObjectSizes.size_x / 2) - styleInformation.width / 2;
                position.y = drawObjectSizes.size_y - (styleInformation.size / 2);
                break;

              case 'center':
                if (labelOrientation == 'vertical') {
                  position.x = -(drawObjectSizes.size_y + styleInformation.width) / 2;
                  position.y = (drawObjectSizes.size_x / 2) + (styleInformation.size / 2);
                } else {
                  position.x = (drawObjectSizes.size_x / 2) - styleInformation.width / 2;
                  position.y = (drawObjectSizes.size_y / 2) + (styleInformation.size / 2);
                }
                break;

              case 'left':
                position.x = -(drawObjectSizes.size_y + styleInformation.width) / 2;
                position.y = styleInformation.size;
                break;

              case 'right':
                position.x = -(drawObjectSizes.size_y + styleInformation.width) / 2;
                position.y = drawObjectSizes.size_x - (styleInformation.size / 2);
                break;
            }

            if (labelOrientation == 'vertical') {
              _rotateContext(-Math.PI / 2);
              priv.context.fillText(curLabelObject.text, position.x, position.y);
              _resetRotation();
            } else {
              priv.context.fillText(curLabelObject.text, position.x, position.y);
            }
          }
        }
        priv.context.translate(-drawObjectSizes.pos_x, -drawObjectSizes.pos_y);
      }
    },
    _rotateContext = function (rotateValue) {
      priv.curRotation = rotateValue;
      priv.context.rotate(rotateValue);
    },
    _resetRotation = function () {
      var rotationFix = 0 - priv.curRotation;
      priv.context.rotate(rotationFix);
      priv.curRotation = 0;
    },
    _calculateAndSetFontStyle = function (labelObject, drawObject, maxWidth) {
      var objectsToCheck = [
          priv.drawInfo.font,
          drawObject.font,
          labelObject.font
        ],
        fieldsToCheck = [
          'size',
          'family',
          'color'
        ],
        calculatedValues = {};

      for (var objectKey = 0; objectKey < objectsToCheck.length; objectKey++) {
        var curObject = objectsToCheck[objectKey];
        if (typeof curObject != 'undefined') {
          for (var fieldKey = 0; fieldKey < fieldsToCheck.length; fieldKey++) {
            var curFieldName = fieldsToCheck[fieldKey];
            if (curObject[curFieldName]) {
              calculatedValues[curFieldName] = curObject[curFieldName];
            }
          }
        }
      }

      priv.context.fillStyle = calculatedValues.color;

      var fontSize = calculatedValues.size + 1,
        labelWidth;

      do {
        priv.context.font = --fontSize + 'px ' + calculatedValues.family;
        labelWidth = priv.context.measureText(labelObject.text).width;
      } while (fontSize >= 0 && labelWidth > maxWidth);

      return {
        size: fontSize,
        width: labelWidth,
        family: calculatedValues.family,
        color: calculatedValues.color
      };
    },
    _drawObjectBorders = function (drawObject, sizes) {
      var borderWidth = _calculateX(drawObject.border.width);
      priv.context.beginPath();
      priv.context.lineWidth = borderWidth;
      priv.context.strokeStyle = drawObject.border.color;
      priv.context.rect(sizes.pos_x, sizes.pos_y, sizes.size_x, sizes.size_y);
      priv.context.stroke();
      priv.context.closePath();
    },
    _generateRectangleSizes = function (drawObject) {
      return {
        pos_x: _calculateX(drawObject.pos.x),
        pos_y: _calculateY(drawObject.pos.y),
        size_x: _calculateX(drawObject.size.x),
        size_y: _calculateY(drawObject.size.y)
      };
    },
    _calculateX = function (valueToConvert) {
      return valueToConvert * (priv.canvas.width / priv.drawInfo.grid_width);
    },
    _calculateY = function (valueToConvert) {
      return valueToConvert * (priv.canvas.height / priv.drawInfo.grid_height);
    },
    _setCursor = function (cursor) {
      priv.canvas.style.cursor = cursor;
    },
    _getFillStyleForDrawObject = function (drawObject, hover) {
      var baseObject = {};

      if (priv.selectedIds.indexOf(drawObject.id) > -1) {
        if (drawObject.background_selected) {
          return drawObject.background_selected;
        }
        baseObject = priv.drawInfo.defaults.selected;
      } else if (hover) {
        if (drawObject.background_hover) {
          return drawObject.background_hover;
        }
        baseObject = priv.drawInfo.defaults.backgrounds_hover;
      } else {
        if (drawObject.background) {
          return drawObject.background;
        }
        baseObject = priv.drawInfo.defaults.backgrounds;
      }

      if (drawObject.blocked) {
        return baseObject.blocked;
      } else if (drawObject.bookable) {
        return baseObject.bookable[drawObject.status];
      } else {
        return baseObject.default;
      }
    },
    _getHoveredDrawElement = function (parentElem) {
      var drawObjects = parentElem ? (parentElem.objects) : priv.drawInfo.objects;
      for (var i = 0; i < drawObjects.length; i++) {
        var drawObjectToCheck = drawObjects[i];
        priv.context.beginPath();

        switch (drawObjectToCheck.type) {
          case 'rectangle':
          default:
            priv.context.rect(_calculateX(drawObjectToCheck.pos.x), _calculateY(drawObjectToCheck.pos.y), _calculateY(drawObjectToCheck.size.x), _calculateY(drawObjectToCheck.size.y));
            break;
        }
        var isHovered = priv.context.isPointInPath(priv.mouse.x, priv.mouse.y);
        priv.context.closePath();

        if (isHovered) {
          if (drawObjectToCheck.objects && drawObjectToCheck.objects.length > 0) {
            var hoveredChild = _getHoveredDrawElement(drawObjectToCheck);
            if (hoveredChild) {
              return hoveredChild;
            }
          }

          return drawObjectToCheck;
        }
      }

      return null;
    },
    _initEvents = function () {
      priv.canvas.addEventListener('mousemove', _events.mousemove);
      priv.canvas.addEventListener('click', _events.clickDecision);
      priv.canvas.addEventListener('dblclick', _events.nothing);
    },
    _toggleSelectionStatus = function (drawElement) {
      if (priv.selectedIds.indexOf(drawElement.id) > -1) {
        priv.selectedIds.splice(priv.selectedIds.indexOf(drawElement.id), 1);
        _events.selectionChange(drawElement, false);
        if (priv.selectedIds.length == 0) {
          priv.selectedStatus = '';
        }
        _redrawWholeGraphic();
      } else {
        if (!_filters.selectable(drawElement)) {
          _events.unSelectable(drawElement);
          return;
        }
        if (drawElement.bookable) {
          priv.selectedStatus = drawElement.status;
        }
        priv.selectedIds.push(drawElement.id);
        _events.selectionChange(drawElement, true);
        _redrawWholeGraphic();
      }
    },
    timer,
    dblClickDelay = 350,
    lastClickedElement = null,
    lastEvent = null,
    clicks = 0,
    _events = {
      nothing: function (e) {
        e.preventDefault();
      },
      mousemove: function (e) {
        priv.mouse.x = e.clientX - canvas.getBoundingClientRect().left;
        priv.mouse.y = e.clientY - canvas.getBoundingClientRect().top;
        var curHoverElement = _getHoveredDrawElement();
        if (priv.lastHovered && curHoverElement) {
          if (priv.lastHovered.id == curHoverElement.id) {
            return true;
          }
        }
        priv.lastHovered = curHoverElement;
        pub.redraw();
      },
      clickDecision: function (e) {
        clicks++;  //count clicks
        var clickedElement = _getHoveredDrawElement();

        if (lastClickedElement && lastClickedElement.id != clickedElement.id) {
          clicks = 1;
          //_events.click(lastEvent, clickedElement);
        }

        lastClickedElement = clickedElement;
        lastEvent = e;

        if (clicks === 1) {
          timer = setTimeout(function () {
            _events.click(e, clickedElement);
            clicks = 0;
          }, dblClickDelay);
        } else {
          clearTimeout(timer);
          _events.dblClick(e, clickedElement);
          clicks = 0;
        }
      },
      click: function (e, clickedElement) {
        e.preventDefault();

        if (clickedElement && clickedElement.clickable) {
          if (clickedElement.selectable) {
            _toggleSelectionStatus(clickedElement);
          } else {
            if (priv.selectedIds.length > 0) {
              _events.unSelectable(clickedElement);
              return;
            }

            if (priv.events.click) {
              priv.events.click(e, clickedElement);
            }
          }
        }
      },
      dblClick: function (e, clickedElement) {
        e.preventDefault();
        if (clickedElement && clickedElement.clickable && priv.events.dblClick) {
          priv.events.dblClick(e, clickedElement);
        }
      },
      selectionChange: function (drawElement, selected) {
        if (drawElement && priv.events.selectionChange) {
          priv.events.selectionChange(drawElement, selected);
        }
      },
      unSelectable: function (drawElement) {
        if (drawElement && priv.events.unSelectable) {
          priv.events.unSelectable(drawElement);
        }
      }
    },
    _filters = {
      selectable: function (drawObject) {
        var selectable = false;

        if (!drawObject.blocked && drawObject.bookable && (priv.selectedStatus == drawObject.status || priv.selectedStatus == '')) {
          selectable = true;
        }

        return selectable;
      }
    },
    _findElementByID = function (idToSearch, objectsList) {
      for (var i = 0; i < objectsList.length; i++) {
        var currentElem = objectsList[i];
        if (currentElem.id == idToSearch) {
          return currentElem;
        }

        if (currentElem.objects && currentElem.objects.length > 0) {
          var childResult = _findElementByID(idToSearch, currentElem.objects);
          if (childResult !== null) {
            return childResult;
          }
        }
      }

      return null;
    };

  pub.redraw = function () {
    _redrawWholeGraphic();
  };

  pub.getSelected = function () {
    var returnObjects = [];
    for (var i = 0; i < priv.selectedIds.length; i++) {
      var curIdToSearchFor = priv.selectedIds[i],
        fullObject = _findElementByID(curIdToSearchFor, priv.drawInfo.objects);

      if (fullObject) {
        returnObjects.push(fullObject);
      }
    }

    return returnObjects;
  };

  pub.destruct = function () {
    priv.canvas.removeEventListener('mousemove', _events.mousemove);
    priv.canvas.removeEventListener('click', _events.clickDecision);
    priv.canvas.removeEventListener('dblclick', _events.nothing);
  };

  _init();
}